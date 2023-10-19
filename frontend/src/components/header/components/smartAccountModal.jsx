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

function SmartAccountModal({
  list,
  isAbstract,
  activeAddress,
  provider,
  signer,
  setSafeAuthSignInResponse,
}) {
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
   

      const hashOfTx =  hashMessage(JSON.stringify(safeTransactionRelay.data))

      let signatureData = ''
      let signedVersion = {}
    try {
      // eslint-disable-next-line react/prop-types
      signatureData = await provider.send('eth_sign', [
        // eslint-disable-next-line react/prop-types
        (await signer.getAddress()).toLowerCase(),
        hexlify(hashOfTx)
      ])

    } catch (err) {
       signedVersion = await newSafeData.signTransaction(safeTransactionRelay)
       signatureData = signedVersion.encodedSignatures()
             // eslint-disable-next-line react/prop-types

    }
    


      const request = await axios.post(
        "http://localhost:3012/create-smartaccount",
        JSON.stringify({
          ...safeTransactionRelay,
          signatures: signatureData,
          from: signeAddr,
        })
      );

      setLoading(false);
      const newAddress = request?.data?.smartAccountAddress;
      setSafeAuthSignInResponse((oldData) => ({
        eoa: signeAddr,
        safes: [newAddress, ...oldData?.safes],
      }));
      toast.success("Smart Account Created:" + newAddress);
    } catch (err) {
      console.log(err);
      toast.error("Failed to create smart account");
    }
    setLoading(false);
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
              onClick={createNewSmartAcc}
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
                <div className="smartAccountModalListItemWrapper" key={index}>
                  <div className="smartAccountModalListItem">
                    <div className="smartAccountModalListItemAddress">
                      {item}
                    </div>
                    <div className="smartAccountModalListItemBalance">
                      0.01 ETH
                    </div>
                  </div>

                  <button
                    className="smartAccountModalListItemCopy"
                    onClick={() => {
                      navigator.clipboard.writeText(item);
                      toast.success("Address Copied");
                    }}
                    title="Copy Address"
                  >
                    <AiOutlineCopy className="smartAccountModalListItemCopyIcon" />
                  </button>
                </div>
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
