import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Logo from "@/assets/vite.svg";
import "./index.css";
import { Web3Provider } from "@ethersproject/providers";
import { EthersAdapter, SafeFactory } from "@safe-global/protocol-kit";
import toast from "react-hot-toast";
import AccountModal from "./components/accountModal";
import SmartAccountModal from "./components/smartAccountModal";

function Header({
  login,
  authData,
  logout,
  modalProvider,
  setSafeAuthSignInResponse,
}) {
  console.log(authData, "authData");

  // authData.safes    => ARRAY OF SMART ACCOUNT
  // authData.eoa => main wallet address

  const [chainId, setChainId] = useState(null);
  const [signer, setSigner] = useState(null);
  const [provider, setProvider] = useState(null);
  useEffect(() => {
    if (authData) {
      let provider_ = new Web3Provider(modalProvider?.getProvider());
      setProvider(provider_);

      let signer_ = provider_?.getSigner();

      setSigner(signer_);

      const getChainId = async () => {
        try {
          let res = await signer_?.getChainId();
          setChainId(res);
        } catch (err) {
          console.log(err);
          setChainId(null);
        }
      };

      getChainId();
    }
  }, [authData]);

  console.log(chainId, "chainId");
  console.log(signer, "signer");
  console.log(provider, "provider");

  const handleSwitchNetwork = async () => {
    if (typeof window.ethereum === "undefined") {
      toast.error("Metamask not found. Please install Metamask");
      return;
    }

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x5" }],
      });
      toast.success("Successfully switched to Goerli");

      //*todo
      setChainId(5);
    } catch (error) {
      console.error(error);
      toast.error("Failed to switch to Goerli");
    }
  };

  return (
    <div className="header">
      <Link to="/" className="headerLogo">
        <img src={Logo} alt="logo" draggable="false" />
        <span>TICK3T</span>
      </Link>

      <div className="headerRightContent">
        {authData === null ? (
          <button className="connectBtn" onClick={login}>
            Connect
          </button>
        ) : chainId !== 5 ? (
          <button
            className="connectBtn"
            onClick={handleSwitchNetwork}
            style={{
              background: "red",
            }}
          >
            Switch to Goerli
          </button>
        ) : (
          <>
            <SmartAccountModal list={authData?.safes} />
            <AccountModal address={authData?.eoa} logout={logout} />
          </>
        )}
      </div>
    </div>
  );
}

export default Header;
