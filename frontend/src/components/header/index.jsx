import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Logo from "@/assets/vite.svg";
import "./index.css";

import toast from "react-hot-toast";
import AccountModal from "./components/accountModal";
import SmartAccountModal from "./components/smartAccountModal";

function Header({ login, authData, logout, provider, chainId,signer,setSafeAuthSignInResponse }) {
  const [activeAddress, setActiveAddress] = useState(null);
  const [isAbstract, setIsAbstract] = useState(false);

  const getActiveAccount = () => {
    let localStrgAbstract = localStorage.getItem("abstractAccount");
    let localStrgActive = localStorage.getItem("activeAddress");

    if (localStrgAbstract) {
      setIsAbstract(localStrgAbstract === "true" ? true : false);
    } else {
      setIsAbstract(false);
      localStorage.setItem("abstractAccount", false);
    }

    if (localStrgActive) {
      setActiveAddress(localStrgActive);
    } else {
      setActiveAddress(authData?.eoa || null);
      localStorage.setItem("activeAddress", authData?.eoa || null);
    }
  };

  useEffect(() => {
    getActiveAccount();
  }, [authData]);

  console.log("activeAddress", activeAddress);
  console.log("isAbstract", isAbstract);

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
        {authData === null || chainId === null ? (
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
            <SmartAccountModal
              list={authData?.safes}
              provider={provider}
              isAbstract={isAbstract}
              activeAddress={activeAddress}
              signer={signer}
              setSafeAuthSignInResponse={setSafeAuthSignInResponse}
            />
            <AccountModal
              address={authData?.eoa}
              logout={logout}
              isAbstract={isAbstract}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default Header;
