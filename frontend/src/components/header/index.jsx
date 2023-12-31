import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Logo from "@/assets/vite.svg";
import "./index.css";
import logo from "../../assets/ticket_logo.png";
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

  if (safeAuthSignInResponse === null || chainId === null || chainId !== 5) {
    return (
      <div className="header headerMobileWrapper">
        <div className="headerLeft headerLeftMobile">
          <Link to="/" className={`headerLogo mobileHeaderLogo`}>
            <img src={logo} alt="logo" draggable="false" />
          </Link>
        </div>

         {!location.pathname.includes("verify/qr")&&( <div className="headerRightContent headerRightMobile">
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
          ) : null}
        </div>)}
      </div>
    );
  } else {
    return (
      <div className="header">
        <div className="headerLeft">
          <Link
            to="/"
            className={`headerLogo ${!safeAuthSignInResponse && "mobileLogo"}`}
          >
            <img src={logo} alt="logo" draggable="false" />
            {/* <span>TICK<b>3</b>T</span> */}
          </Link>
          {   !location.pathname.includes("verify/qr")&&safeAuthSignInResponse && (
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

        { !location.pathname.includes("verify/qr") && (<div className="headerRightContent">
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
        </div>)}
      </div>
    );
  }
}

export default Header;
