import React, { useEffect, useState } from "react";
import { Modal } from "antd";
import { getEthBalance } from "../../../utils/getEthBalance";

import { AiOutlineCopy } from "react-icons/ai";
import { IoExitOutline } from "react-icons/io5";
import { TiTick } from "react-icons/ti";
import { useDispatch, useSelector } from "react-redux";
import { handleLogout } from "@/redux/authSlice";

import "../index.css";

function AccountModal() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const dispatch = useDispatch();
  const { safeAuthSignInResponse, isAbstract, web3AuthModalPack } = useSelector(
    (state) => state.auth
  );

  const [copyButtonText, setCopyButtonText] = useState("Copy Address");
  const handleCopyAddress = async () => {
    navigator.clipboard.writeText(safeAuthSignInResponse?.eoa);
    setCopyButtonText("Copied!");

    await new Promise((resolve) => setTimeout(resolve, 1000));

    setCopyButtonText("Copy Address");
  };

  const [balance, setBalance] = useState(0);

  const getUserBalance = async () => {
    try {
      let res = await getEthBalance({ address: safeAuthSignInResponse?.eoa });
      setBalance(res);
    } catch (err) {
      console.log(err);
      setBalance(0);
    }
  };

  useEffect(() => {
    getUserBalance();
  }, [safeAuthSignInResponse]);

  return (
    <>
      <button
        onClick={showModal}
        className={isAbstract ? "useSmartAccountBtn" : "abstractAccountBtn"}
      >
        {safeAuthSignInResponse?.eoa?.slice(0, 6) +
          "..." +
          safeAuthSignInResponse?.eoa?.slice(-4)}
      </button>

      <Modal open={isModalOpen} onCancel={handleCancel} footer={null} centered>
        <div className="accountModal">
    
          <div className="accountModalWallet">
            <span>
              {safeAuthSignInResponse?.eoa?.slice(0, 10) +
                "..." +
                safeAuthSignInResponse?.eoa?.slice(-8)}
            </span>
            <span>
              {parseFloat(balance?.toString(10) / 10 ** 18).toLocaleString(
                "en-US",
                {
                  maximumFractionDigits: 6,
                }
              )}{" "}
              ETH
            </span>
          </div>
          <div className="accountModalButtons">
            <button
              onClick={handleCopyAddress}
              disabled={copyButtonText === "Copied!"}
            >
              {copyButtonText === "Copied!" ? (
                <TiTick className="accountModalButtonsIcon" />
              ) : (
                <AiOutlineCopy className="accountModalButtonsIcon" />
              )}
              <span>{copyButtonText}</span>
            </button>
            <button
              onClick={() => dispatch(handleLogout({ web3AuthModalPack }))}
            >
              <IoExitOutline className="accountModalButtonsIcon" />
              <span>Disconnect</span>
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default AccountModal;
