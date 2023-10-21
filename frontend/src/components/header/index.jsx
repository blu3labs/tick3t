import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Logo from "@/assets/vite.svg";
import "./index.css";

import toast from "react-hot-toast";
import AccountModal from "./components/accountModal";
import SmartAccountModal from "./components/smartAccountModal";
import { useDispatch, useSelector } from "react-redux";
import { handleLogin, setChainId } from "../../redux/authSlice";

function Header() {
  const location = useLocation();
  let isCreatePage = location.pathname === "/create-event";
  let isMyTicketsPage = location.pathname === "/my-tickets";

  const dispatch = useDispatch();
  const { safeAuthSignInResponse, chainId, web3AuthModalPack } = useSelector(
    (state) => state.auth
  );
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
      dispatch(setChainId(5));
      toast.success("Successfully switched to Goerli");
    } catch (error) {
      console.error(error);
      toast.error("Failed switch to Goerli");
    }
  };

  console.log("safeAuthSignInResponse", safeAuthSignInResponse);

  return (
    <div className="header">
      <div className="headerLeft">
        <Link
          to="/"
          className={`headerLogo ${!safeAuthSignInResponse && "mobileLogo"}`}
        >
          <img src={Logo} alt="logo" draggable="false" />
          <span>TICK3T</span>
        </Link>
        {safeAuthSignInResponse && (
          <div className="headerLinks">
            <Link
              to="/create-event"
              className="headerLinkItem"
              style={{
                color: isCreatePage && "var(--accent-color)",
              }}
            >
              Create
            </Link>
            <Link
              to="/my-tickets"
              className="headerLinkItem"
              style={{
                color: isMyTicketsPage && "var(--accent-color)",
              }}
            >
              My Tickets
            </Link>
          </div>
        )}
      </div>

      <div className="headerRightContent">
        {safeAuthSignInResponse === null || chainId === null ? (
          <button
            className="connectBtn"
            onClick={() => dispatch(handleLogin({ web3AuthModalPack }))}
          >
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
            <SmartAccountModal />
            <AccountModal />
          </>
        )}
      </div>
    </div>
  );
}

export default Header;
