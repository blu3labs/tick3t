import React, { useState } from "react";
import { Modal } from "antd";
import { AiOutlineCopy } from "react-icons/ai";
import { toast } from "react-hot-toast";
import "../index.css";

function SmartAccountModal({ list }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const createNewSmartAcc = async () => {
    const createNewSmartAccount = async () => {
      const txServiceUrl = "https://safe-transaction-goerli.safe.global";

      setLoading(true);
      const provider = new Web3Provider(modalProvider.getProvider());
      const signer = provider.getSigner();
      const ethAdapter = new EthersAdapter({
        ethers,
        signerOrProvider: signer,
      });
      // const safeService = new SafeApiKit({ txServiceUrl, ethAdapter })

      // const signInInfo = await web3AuthModalPack?.signIn()
      const signeAddr = await signer.getAddress();
      const ownersData = [signeAddr];
      const safeFactoryC = {
        owners: ownersData,
        threshold: 1,
      };

      // const safeFactory = await SafeFactory.create({
      //   ethAdapter

      // })

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
      //let's create our safe smart account

      const safeTransactionRelay = await relayKit.createRelayedTransaction({
        safe: newSafeData,
        transactions: [
          { data: txNewSafe.data, to: txNewSafe.to, value: txNewSafe.value },
        ],
      });

      const signedSafeTransaction = await newSafeData.signTransaction(
        safeTransactionRelay
      );

      const sign = signedSafeTransaction.encodedSignatures();

      const request = await axios.post(
        "https://blu3labs-tick3t-bundler.blu3.app/create-smartaccount",
        JSON.stringify({
          ...signedSafeTransaction,
          signatures: sign,
          from: signeAddr,
        })
      );

      setLoading(false);
      const newAddress = request.data.smartAccountAddress;
      setSafeAuthSignInResponse((oldData) => ({
        eoa: signeAddr,
        safes: [newAddress, ...oldData?.safes],
      }));
      toast.success("Smart Account Created:" + newAddress);
    };
  };



  let isAbstractAccount = false;
  return (
    <>
      <button onClick={showModal}

      className={
        isAbstractAccount ? "abstractAccountBtn" : "useSmartAccountBtn"
      }
      
      >
        {isAbstractAccount ? "0xcd54...54564" : "Use Smart Account"}
      </button>
      <Modal open={isModalOpen} onCancel={handleCancel} footer={null} centered>
        <div className="smartAccountModal">
          <div className="smartAccountModalTitle">Your Smart Accounts</div>
          <button onClick={createNewSmartAcc} className="smartAccountCreateBtn">Create New Smart Account</button>
          <button onClick={createNewSmartAcc} className="smartAccountCreateBtn"
            style={{
                backgroundColor: "var(--accent-color)",
                color: "white",
            }}
          >Switch Back to EOA</button>
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
