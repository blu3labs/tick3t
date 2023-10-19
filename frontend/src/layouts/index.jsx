import { Outlet } from "react-router-dom";
import AppWrapper from "@/ui/wrapper/app";
import Header from "@/components/header";
import toast, { Toaster } from "react-hot-toast";
import {
  ADAPTER_EVENTS,
  CHAIN_NAMESPACES,
  WALLET_ADAPTERS,
} from "@web3auth/base";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { Web3AuthModalPack } from "@safe-global/auth-kit";
import { useEffect, useState } from "react";
import { Web3Provider } from "@ethersproject/providers";
import GeneralLoading from "../components/generalLoading";



export default function MainLayout() {
  const connectedHandler = () => console.log("CONNECTED");
  const disconnectedHandler = () => console.log("DISCONNECTED");

  const [web3AuthModalPack, setWeb3AuthModalPack] = useState();
  const [safeAuthSignInResponse, setSafeAuthSignInResponse] = useState(
    JSON.parse(localStorage.getItem("safe-auth-sign-in-response")) || null
  );

  useEffect(() => {
    (async () => {
      const options = {
        clientId:
          "BBpDQVTjPZubZrGp18Vrdig7buc7WWRGQWl4jGUfRkpHWyPgM4DK7yHCs18BNtslGjAPndswugK98ieNxm2ZgVY",
        web3AuthNetwork: "testnet",
        chainConfig: {
          chainNamespace: CHAIN_NAMESPACES.EIP155,
          chainId: "0x5",
          rpcTarget: `https://goerli.blockpi.network/v1/rpc/public`,
        },
        uiConfig: {
          loginMethodsOrder: ["google", "facebook"],
          theme: "light",
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
  }, [safeAuthSignInResponse]);

  const login = async () => {
    if (!web3AuthModalPack) return;
    const signInInfo = await web3AuthModalPack.signIn();
    setSafeAuthSignInResponse(signInInfo);
    localStorage.setItem(
      "safe-auth-sign-in-response",
      JSON.stringify(signInInfo)
    );
  };

  const logout = async () => {
    if (!web3AuthModalPack) return;
    await web3AuthModalPack.signOut();
    setSafeAuthSignInResponse(null);
    localStorage.removeItem("safe-auth-sign-in-response");
  };

  const [chainId, setChainId] = useState(null);
  const [signer, setSigner] = useState(null);
  const [provider, setProvider] = useState(null);

  useEffect(() => {
    if (web3AuthModalPack && safeAuthSignInResponse) {
      let provider_ = new Web3Provider(web3AuthModalPack?.getProvider());
      setProvider(provider_);
    }
  }, [web3AuthModalPack, safeAuthSignInResponse]);

  useEffect(() => {
    if (provider) {
      let signer_ = provider.getSigner();
      setSigner(signer_);

    }
  }, [provider]);

  useEffect(() => {
    if (signer) {
      const getChainId = async () => {
        try {
          let res = await signer?.getChainId();
          setChainId(res);
        } catch (err) {
          console.log(err);
          setChainId(null);
        }
      };

      getChainId();
    }
  }, [signer]);

  console.log("chainId", chainId);
  console.log("signer", signer);
  console.log("provider", provider);


  if (!web3AuthModalPack) return <GeneralLoading />;

  return (
    <AppWrapper>
      <Toaster />

      <Header
        login={login}
        logout={logout}
        provider={provider}
        authData={safeAuthSignInResponse}
        setSafeAuthSignInResponse={setSafeAuthSignInResponse}
        signer={signer}
        chainId={chainId}
     
      />
      <Outlet />
    </AppWrapper>
  );
}
