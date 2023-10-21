import React, { useState } from "react";
import { Modal } from "antd";
import { AiOutlineCopy } from "react-icons/ai";
import { toast } from "react-hot-toast";
import axios from "axios";
import { ethers } from "ethers";
import Safe, { EthersAdapter } from "@safe-global/protocol-kit";
import { GelatoRelayPack } from "@safe-global/relay-kit";
import Spin from "@/ui/spin";
import "../index.css";
import { hashMessage, hexlify, recoverAddress } from "ethers/lib/utils";
import { BUNDLER_API_URL } from "../../../utils/apiUrls";
import AbstractAccount from "./abstractAccount";
import { useDispatch, useSelector } from "react-redux";
import {
  setActiveAddress,
  setIsAbstract,
  setSafeAuthSignInResponse,
} from "../../../redux/authSlice";

function SmartAccountModal() {
  const dispatch = useDispatch();
  const {
    safeAuthSignInResponse,
    isAbstract,
    activeAddress,
    provider,
    signer,
  } = useSelector((state) => state.auth);

  let walletAddress = safeAuthSignInResponse?.eoa;
  let list = safeAuthSignInResponse?.safes;


  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const [loading, setLoading] = useState(false);
  const createNewSmartAcc = async () => {
    if (!signer) {
      toast.error("Please connect your wallet");
      return;
    }

    setLoading(true);
    try {
      const ethAdapter = new EthersAdapter({
        ethers,
        signerOrProvider: signer,
      });

      // eslint-disable-next-line react/prop-types
      const signeAddr = await signer?.getAddress();
      const ownersData = [signeAddr];
      const safeFactoryC = {
        owners: ownersData,
        threshold: 1,
      };

      const newSafeData = await Safe.create({
        ethAdapter,

        predictedSafe: {
          safeAccountConfig: safeFactoryC,
        },
      });

      const relayKit = new GelatoRelayPack(
        "_mhz0rzLWDbZ6_qEdg9c5qF50kgQ_XuKOlTFxXVdIbg_"
      );

      const txNewSafe = await newSafeData.createSafeDeploymentTransaction(
        undefined,
        {
          gasLimit: 1000000,
        }
      );

      const safeTransactionRelay = await relayKit.createRelayedTransaction({
        safe: newSafeData,
        transactions: [
          { data: txNewSafe.data, to: txNewSafe.to, value: txNewSafe.value },
        ],
      });

      const hashOfTx = hashMessage(JSON.stringify(safeTransactionRelay.data));

      let signatureData = "";
      let signedVersion = {};
      try {
        // eslint-disable-next-line react/prop-types
        signatureData = await provider.send("eth_sign", [
          // eslint-disable-next-line react/prop-types
          (await signer.getAddress()).toLowerCase(),
          hexlify(hashOfTx),
        ]);
      } catch (err) {
        signedVersion = await newSafeData.signTransaction(safeTransactionRelay);
        signatureData = signedVersion.encodedSignatures();
        // eslint-disable-next-line react/prop-types
      }

      const request = await axios.post(
        BUNDLER_API_URL + "/create-smartaccount",
        JSON.stringify({
          ...safeTransactionRelay,
          signatures: signatureData,
          from: signeAddr,
        })
      );

      setLoading(false);
      const newAddress = request?.data?.smartAccountAddress;
      dispatch(
        setSafeAuthSignInResponse((oldData) => ({
          eoa: signeAddr,
          safes: [newAddress, ...oldData?.safes],
        }))
      );
      toast.success(
        "Smart Account Created:" +
          newAddress?.slice(0, 5) +
          "..." +
          newAddress?.slice(-3)
      );
    } catch (err) {
      console.log(err);
      toast.error("Failed to create smart account");
    }
    setLoading(false);
  };

  const handleBackToEOA = async () => {
    dispatch(setActiveAddress(walletAddress));
    dispatch(setIsAbstract(false));
  };

  const handleSwitchAbstractAccount = async (item) => {
    if (item?.toLowerCase() === activeAddress?.toLowerCase()) {
      return;
    }

    dispatch(setActiveAddress(item));
    dispatch(setIsAbstract(true));
  };

  return (
    <>
      <button
        onClick={showModal}
        className={isAbstract ? "abstractAccountBtn" : "useSmartAccountBtn"}
      >
        {isAbstract
          ? activeAddress
            ? activeAddress?.slice(0, 6) + "..." + activeAddress?.slice(-4)
            : "Abstract Account"
          : "Use Smart Account"}
      </button>
      <Modal open={isModalOpen} onCancel={handleCancel} footer={null} centered>
        <div className="smartAccountModal">
          <div className="smartAccountModalTitle">Your Smart Accounts</div>

          <button
            onClick={createNewSmartAcc}
            className="smartAccountCreateBtn"
            disabled={loading}
            style={{
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.5 : 1,
            }}
          >
            {loading
              ? "New Smart Account Creating..."
              : "Create New Smart Account"}
          </button>
          {isAbstract && (
            <button
              onClick={handleBackToEOA}
              className="smartAccountCreateBtn"
              style={{
                backgroundColor: "var(--accent-color)",
                color: "white",
              }}
            >
              Switch Back to EOA
            </button>
          )}
          <div className="smartAccountModalList">
            {list?.length > 0 ? (
              list?.map((item, index) => (
                <AbstractAccount
                  key={index}
                  item={item}
                  index={index}
                  activeAddress={activeAddress}
                  handleSwitchAbstractAccount={handleSwitchAbstractAccount}
                />
              ))
            ) : (
              <div className="smartAccountModalListEmpty">
                You don't have any smart account yet
              </div>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
}

export default SmartAccountModal;
