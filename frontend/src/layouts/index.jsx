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
import { useDispatch, useSelector } from "react-redux";
import {
  setWeb3AuthModalPack,
  walletController,
  setProvider,
  setSigner,
  setChainId,
} from "@/redux/authSlice";

export default function MainLayout() {
  const dispatch = useDispatch();
  const { web3AuthModalPack, safeAuthSignInResponse, signer, provider } =
    useSelector((state) => state.auth);

  const connectedHandler = () => console.log("CONNECTED");
  const disconnectedHandler = () => console.log("DISCONNECTED");

  useEffect(() => {
    (async () => {
      const options = {
        clientId:
          "BNyoiGcDjixUu0VUQ8iZjftokDfv4odRBzV4cxhHVmXGc9K3FwBSHW10q0J9M824lSTH7xE9eO-8KGzI4Ghr-Rk",
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

      dispatch(setWeb3AuthModalPack(web3AuthModalPack));

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

  useEffect(() => {
    dispatch(walletController());
  }, [safeAuthSignInResponse]);

  useEffect(() => {
    if (web3AuthModalPack && safeAuthSignInResponse) {
      try {
        let provider_ = new Web3Provider(web3AuthModalPack?.getProvider());
        dispatch(setProvider(provider_));
      } catch (err) {
        console.log(err);
        dispatch(setProvider(null));
      }
    }
  }, [web3AuthModalPack, safeAuthSignInResponse]);

  useEffect(() => {
    if (provider) {
      try {
        let signer_ = provider.getSigner();
        dispatch(setSigner(signer_));
      } catch (err) {
        console.log(err);
        dispatch(setSigner(null));
      }
    }
  }, [provider]);

  useEffect(() => {
    if (signer) {
      const getChainId = async () => {
        try {
          let res = await signer?.getChainId();
          dispatch(setChainId(res));
        } catch (err) {
          console.log(err);
          dispatch(setChainId(null));
        }
      };

      getChainId();
    }
  }, [signer]);

  if (web3AuthModalPack === null || web3AuthModalPack === undefined) {
    return <GeneralLoading />;
  }

  return (
    <AppWrapper>
      <Toaster />
      <Header />
      <Outlet />
    </AppWrapper>
  );
}
