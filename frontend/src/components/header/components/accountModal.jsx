import React, { useEffect, useState } from "react";
import { Modal } from "antd";
import { getEthBalance } from "../../../utils/getEthBalance";
import { MetaMaskAvatar } from "react-metamask-avatar";
import { AiOutlineCopy } from "react-icons/ai";
import { IoExitOutline } from "react-icons/io5";
import { TiTick } from "react-icons/ti";
import "../index.css";

function AccountModal({ address, logout,isAbstract }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    setIsModalOpen(false);
  };

  const [copyButtonText, setCopyButtonText] = useState("Copy Address");
  const handleCopyAddress = async () => {



    navigator.clipboard.writeText(address);
    setCopyButtonText("Copied!");

    await new Promise((resolve) => setTimeout(resolve, 1000));

    setCopyButtonText("Copy Address");
  };

  const [balance, setBalance] = useState(0);

  const getUserBalance = async () => {
    try {
      let res = await getEthBalance({ address });
      setBalance(res);
    } catch (err) {
      console.log(err);
      setBalance(0);
    }
  };

  useEffect(() => {
    getUserBalance();
  }, [address]);

  return (
    <>
      <button onClick={showModal}  className={
        isAbstract ? "useSmartAccountBtn" : "abstractAccountBtn"
      }>
        {address?.slice(0, 6) + "..." + address?.slice(-4)}
      </button>

      <Modal open={isModalOpen} onCancel={handleCancel} footer={null} centered>
        <div className="accountModal">
          <MetaMaskAvatar address={address} size={64} />
          <div className="accountModalWallet">
            <span>{address?.slice(0, 10) + "..." + address?.slice(-8)}</span>
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
            <button onClick={handleCopyAddress}
            disabled={copyButtonText === "Copied!"}
            
            >
              {copyButtonText === "Copied!" ? (
                <TiTick className="accountModalButtonsIcon" />
              ) : (
                <AiOutlineCopy className="accountModalButtonsIcon" />
              )}
              <span>{copyButtonText}</span>
            </button>
            <button onClick={handleLogout}>
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
