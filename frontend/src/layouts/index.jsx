import { Outlet } from "react-router-dom";
import AppWrapper from "@/ui/wrapper/app";
import Header from "@/components/header";
import { Toaster } from "react-hot-toast";
import {
  ADAPTER_EVENTS,
  CHAIN_NAMESPACES,
  WALLET_ADAPTERS,
} from "@web3auth/base";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { Web3AuthModalPack } from "@safe-global/auth-kit";
import { Buffer } from "buffer";
import { useEffect, useState } from "react";

export default function MainLayout() {
  const connectedHandler = (data) => console.log("CONNECTED", data);
  const disconnectedHandler = (data) => console.log("DISCONNECTED", data);
  const [web3AuthModalPack, setWeb3AuthModalPack] = useState();
  const [safeAuthSignInResponse, setSafeAuthSignInResponse] = useState(null);
  const [userInfo, setUserInfo] = useState();
  const [provider, setProvider] = useState(null);
  // Initialize Web3Auth

  useEffect(() => {
    (async () => {
      const options = {
        clientId:
          "BPuRRfHaSiEY7lO6bxcDaBkNM12nfcedhdB6w3QPuLOPsu-MqR0Zbq918xazA76nBM586rsFsVbZ3sTNnfGFnis",
        web3AuthNetwork: "testnet",
        chainConfig: {
          chainNamespace: CHAIN_NAMESPACES.EIP155,
          chainId: "0x5",
          rpcTarget: `https://rpc.goerli.eth.gateway.fm`,
        },
        uiConfig: {
          loginMethodsOrder: ["google", "facebook"],
          theme: "light"
        },
      };

      const modalConfig = {
        [WALLET_ADAPTERS.TORUS_EVM]: {
          label: "torus",
          showOnModal: false,
        },
        [WALLET_ADAPTERS.METAMASK]: {
          label: "Metamask",
          showOnDesktop: true,
          showOnMobile: false,
       
        },
        
      };

      const pvkeyProvider = new EthereumPrivateKeyProvider({
        config: { chainConfig: options.chainConfig },
      });

      const openloginAdapter = new OpenloginAdapter({
        loginSettings: {
          mfaLevel: "mandatory",
        },
        adapterSettings: {
          uxMode: "popup",
          whiteLabel: {
            name: "Safe",
          },
        },
        privateKeyProvider: pvkeyProvider,
      });

      const web3AuthModalPack = new Web3AuthModalPack({
        txServiceUrl: "https://safe-transaction-goerli.safe.global",
      });

      await web3AuthModalPack.init({
        options,
        adapters: [openloginAdapter],
        modalConfig,
      });

      web3AuthModalPack.subscribe(ADAPTER_EVENTS.CONNECTED, connectedHandler);

      web3AuthModalPack.subscribe(
        ADAPTER_EVENTS.DISCONNECTED,
        disconnectedHandler
      );

      setWeb3AuthModalPack(web3AuthModalPack);

      return () => {
        web3AuthModalPack.unsubscribe(
          ADAPTER_EVENTS.CONNECTED,
          connectedHandler
        );
        web3AuthModalPack.unsubscribe(
          ADAPTER_EVENTS.DISCONNECTED,
          disconnectedHandler
        );
      };
    })();
  }, []);

  const login = async () => {
    if (!web3AuthModalPack) return;

    const signInInfo = await web3AuthModalPack.signIn();
    console.log("SIGN IN RESPONSE: ", signInInfo);

    const userInfo = await web3AuthModalPack.getUserInfo();
    console.log("USER INFO: ", userInfo);

    setSafeAuthSignInResponse(signInInfo);
    setUserInfo(userInfo || undefined);
    setProvider(web3AuthModalPack.getProvider());
  };

  const logout = async () => {
    if (!web3AuthModalPack) return;

    await web3AuthModalPack.signOut();

    setProvider(null);
    setSafeAuthSignInResponse(null);
  };

  return (
    <AppWrapper>
      <Toaster />
      <Header
        login={login}
        authData={safeAuthSignInResponse}
        logout={logout}
        modalProvider={web3AuthModalPack}
        setSafeAuthSignInResponse={setSafeAuthSignInResponse}
      />
      <Outlet />
    </AppWrapper>
  );
}
