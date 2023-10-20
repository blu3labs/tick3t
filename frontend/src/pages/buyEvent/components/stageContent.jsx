import React, { useState } from "react";
import SelectBox from "@/ui/selectBox";
import { toast } from "react-hot-toast";
import "../index.css";

function StageContent({ data,id }) {
  const [category, setCategory] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const categoryOptions = [
    {
      value: "Diamond",
      label: "Diamond",
    },
    {
      value: "Gold",
      label: "Gold",
    },
    {
      value: "General",
      label: "General",
    },
  ];

  const quantityOptions = Array(5)
    .fill(0)
    .map((item, index) => {
      return {
        value: index + 1,
        label: index + 1,
      };
    });

  const [wallets, setWallets] = useState([
    {
      id: 1,
      name: "Ticket 1",
      address: null,
    },
    {
      id: 2,
      name: "Ticket 2",
      address: null,
    },
    {
      id: 3,
      name: "Ticket 3",
      address: null,
    },
    {
      id: 4,
      name: "Ticket 3",
      address: null,
    },
    {
      id: 5,
      name: "Ticket 3",
      address: null,
    },
  ]);

  const myWalletAddress = "0x1234567890123456789012345678901234567890";

  const inputError = (address) => {
    if (address === null) {
      return false;
    } else if (address === "") {
      return "Wallet address can not be empty.";
    } else if (address.length < 42) {
      return "Wallet address is too short.";
    } else if (address.length > 42) {
      return "Wallet address is too long.";
    } else if (address.slice(0, 2) !== "0x") {
      return "Wallet address must start with 0x.";
    } else {
      return false;
    }
  };

  const [step, setStep] = useState(1);

  const handleNext = () => {
    if (category === null) {
      toast.error("Please select category");
      return;
    }

    if (quantity === null) {
      toast.error("Please select quantity");
      return;
    }

    let walletError = false;

    for (let i = 0; i < quantity; i++) {
      if (inputError(wallets[i].address) || wallets[i].address === null) {
        walletError = true;
        break;
      }
    }

    if (walletError) {
      toast.error("Please enter valid wallet address");
      return;
    }

    setStep(2);
  };

  const handleChangeCategory = (value) => {
    if (step === 2) {
      toast.error("Please go back to previous step");
      return;
    }

    setCategory(value);
  };

  const handleBuy = async () => {
    try {
      const data = {
        category: category,
        quantity: quantity,
        wallets: wallets?.slice(0, quantity),
      };

      console.log(data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="eventBuyBottomSection">
      <div className="eventStageLeftSection">
        <div className="createLocationPreview">
          <div className="createLocationPreviewTitle">
            <span>The Avenue, Paris</span>
          </div>
          <div className="createLocationPreviewContent">
            <div
              className="createLocationPreviewContentItem buyEventStage"
              style={{
                background:
                  "linear-gradient(-72deg,#dedeff,#fff 16%,#dedeff 27%,#dedeff 36%,#fff 45%,#fff 60%,#dedeff 72%,#fff 80%,#dedeff 84%)",
              }}
              onClick={() => handleChangeCategory("Diamond")}
            >
              <span>Diamond</span>
              <span>0.1 ETH</span>
            </div>
            <div
              className="createLocationPreviewContentItem buyEventStage"
              style={{
                background:
                  "linear-gradient(to right, rgb(191, 149, 63), rgb(252, 246, 186), #e3a214, rgb(251, 245, 183), rgb(170, 119, 28))",
              }}
              onClick={() => handleChangeCategory("Gold")}
            >
              <span>Gold</span>
              <span>0.01 ETH</span>
            </div>
            <div
              className="createLocationPreviewContentItem buyEventStage"
              style={{
                background:
                  "linear-gradient(to right, rgb(222, 222, 222), rgb(255, 255, 255), rgb(222, 222, 222), rgb(255, 255, 255)",
              }}
              onClick={() => handleChangeCategory("General")}
            >
              <span>General</span>
              <span>0.01 ETH</span>
            </div>
          </div>
        </div>
      </div>

      {step === 1 && (
        <div className="eventStageRightSection">
          <div className="eventRightSectionTopSelectBoxs">
            <SelectBox
              title="Category"
              placeholder="Select Category"
              value={category}
              onChange={(e) => setCategory(e)}
              options={categoryOptions}
            />
            <SelectBox
              title="Quantity"
              value={quantity}
              placeholder="Select Quantity"
              onChange={(e) => setQuantity(e)}
              options={quantityOptions}
            />
          </div>

          {quantity && (
            <div className="eventRightSectionInputBoxs">
              {Array(quantity)
                .fill(0)
                .map((item, index) => {
                  return (
                    <div className="eventRightSectionInputBox">
                      <div className="eventRightSectionInputBoxHeader">
                        <span>{index + 1}.Ticket</span>
                        <button
                          onClick={() => {
                            const tempWallets = [...wallets];
                            tempWallets[index].address = myWalletAddress;
                            setWallets(tempWallets);
                          }}
                        >
                          Use My Wallet
                        </button>
                      </div>
                      <div className="eventRightSectionInputArea">
                        <input
                          type="text"
                          placeholder="Enter your wallet"
                          style={{
                            borderColor:
                              inputError(wallets[index].address) &&
                              "var(--accent-color)",
                          }}
                          value={wallets[index].address}
                          onChange={(e) => {
                            const tempWallets = [...wallets];
                            tempWallets[index].address = e.target.value;
                            setWallets(tempWallets);
                          }}
                        />
                        <p>{inputError(wallets[index].address)}</p>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}

          <button className="buyBtn" onClick={handleNext}>
            Next
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="eventStageRightSection">
          <div className="eventStageStep2">
            <div className="eventStageStep2Title">Summary</div>
            <div className="eventStageStep2Item">
              <span>Category</span>
              <span>{category}</span>
            </div>

            {Array(quantity)
              .fill(0)
              .map((item, index) => {
                return (
                  <div className="eventStageStep2Item">
                    <span>{index + 1}.Ticket</span>
                    <span title={wallets[index].address}>
                      {wallets[index].address}
                    </span>
                  </div>
                );
              })}

            <div className="eventStageStep2Item">
              <span>Total Cost</span>
              <span>
                {quantity} x {category} (0.1 ETH) = {quantity * 0.1} ETH
              </span>
            </div>

            <div className="eventStageStep2Buttons">
              <button className="buyBtn" onClick={() => setStep(1)}>
                Back
              </button>
              <button className="buyBtn" onClick={handleBuy}>
                Buy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StageContent;
