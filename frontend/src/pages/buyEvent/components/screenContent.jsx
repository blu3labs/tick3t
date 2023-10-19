import React, { useState } from "react";
import SelectBox from "@/ui/selectBox";
import { toast } from "react-hot-toast";
import "../index.css";

function ScreenContent({ data }) {
  const [step, setStep] = useState(1);

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

  const handleNext = () => {
    if (seats.length === 0) {
      toast.error("Please select seats.");
      return;
    }

    let walletError = false;

    seats.forEach((item) => {
      if (item.wallet === null || inputError(item.wallet)) {
        walletError = true;
      }
    });

    if (walletError) {
      toast.error("Please enter your wallet address.");
      return;
    }

    setStep(2);
  };

  const handleBuy = async () => {
    try {
      console.log("Buy");
    } catch (err) {
      console.log(err);
    }
  };

  const [seats, setSeats] = useState([]);
  const [disabledSeats, setDisabledSeats] = useState([1, 5, 25, 50, 74, 88]);

  const handleAddorRemoveSeat = (seat) => {
    // seat = { number: 1, price: 0.1, wallet: null}
    // 0-30 : 0.1 ETH
    // 31-60 : 0.01 ETH
    // 61-90 : 0.001 ETH

    let seatsNums = seats?.map((item) => item?.number);

    if (seatsNums?.includes(seat)) {
      setSeats(seats.filter((item) => item.number !== seat));
    } else {
      if (seats.length >= 5) {
        toast.error("You can buy max 5 tickets.");
        return;
      }

      if (disabledSeats.includes(seat)) {
        toast.error("Seat is not available.");
        return;
      }

      if (seat >= 1 && seat <= 30) {
        setSeats([...seats, { number: seat, price: 0.1, wallet: null }]);
      } else if (seat >= 31 && seat <= 60) {
        setSeats([...seats, { number: seat, price: 0.01, wallet: null }]);
      } else if (seat >= 61 && seat <= 90) {
        setSeats([...seats, { number: seat, price: 0.001, wallet: null }]);
      }
    }
  };

  const useMyWallet = (number) => {
    let tempWallets = [...seats];

    tempWallets = tempWallets.map((item) => {
      if (item.number === number) {
        return { ...item, wallet: myWalletAddress };
      } else {
        return item;
      }
    });

    setSeats(tempWallets);
  };

  const handleChangeWallets = (number, value) => {
    let tempWallets = [...seats];

    tempWallets = tempWallets.map((item) => {
      if (item.number === number) {
        return { ...item, wallet: value };
      } else {
        return item;
      }
    });

    setSeats(tempWallets);
  };

  console.log(seats);

  return (
    <div className="eventBuyBottomSection">
      <div className="eventStageLeftSection">
        <div className="createLocationPreview">
          <div className="createLocationPreviewTitle">
            <span>Theatre Hall, Istanbul</span>
          </div>
          <div className="createLocationPreviewContent">
            <div className="createLocationPreviewTheatreItem eventBuySeat">
              {Array(30)
                .fill(0)
                .map((item, index) => {
                  return (
                    <span
                      style={{
                        cursor: disabledSeats.includes(index + 1)
                          ? "not-allowed"
                          : "pointer",
                        background: disabledSeats.includes(index + 1)
                          ? "#d9d9d9"
                          : seats?.find((seat) => seat?.number === index + 1)
                          ? "lime"
                          : "linear-gradient(-72deg,#dedeff,#fff 16%,#dedeff 27%,#dedeff 36%,#fff 45%,#fff 60%,#dedeff 72%,#fff 80%,#dedeff 84%)",
                      }}
                      onClick={() => handleAddorRemoveSeat(index + 1)}
                    >
                      {index + 1}
                    </span>
                  );
                })}
            </div>
            <div className="createLocationPreviewTheatreItem eventBuySeat">
              {Array(30)
                .fill(0)
                .map((item, index) => {
                  return (
                    <span
                      style={{
                        cursor: disabledSeats.includes(index + 31)
                          ? "not-allowed"
                          : "pointer",
                        background: disabledSeats.includes(index + 31)
                          ? "#d9d9d9"
                          : seats?.find((seat) => seat?.number === index + 31)
                          ? "lime"
                          : "linear-gradient(to right, rgb(191, 149, 63), rgb(252, 246, 186), #e3a214, rgb(251, 245, 183), rgb(170, 119, 28))",
                      }}
                      onClick={() => handleAddorRemoveSeat(index + 31)}
                    >
                      {index + 31}
                    </span>
                  );
                })}
            </div>
            <div className="createLocationPreviewTheatreItem eventBuySeat">
              {Array(30)
                .fill(0)
                .map((item, index) => {
                  return (
                    <span
                      style={{
                        cursor: disabledSeats.includes(index + 61)
                          ? "not-allowed"
                          : "pointer",
                        background: disabledSeats.includes(index + 61)
                          ? "#d9d9d9"
                          : seats?.find((seat) => seat?.number === index + 61)
                          ? "lime"
                          : "linear-gradient(to right, rgb(222, 222, 222), rgb(255, 255, 255), rgb(222, 222, 222), rgb(255, 255, 255)",
                      }}
                      onClick={() => handleAddorRemoveSeat(index + 61)}
                    >
                      {index + 61}
                    </span>
                  );
                })}
            </div>
            <div className="eventSeatInfo">
              <div className="eventSeatInfoBox">
                <span
                  style={{
                    background:
                      "linear-gradient(-72deg, rgb(222, 222, 255), rgb(255, 255, 255) 16%, rgb(222, 222, 255) 27%, rgb(222, 222, 255) 36%, rgb(255, 255, 255) 45%, rgb(255, 255, 255) 60%, rgb(222, 222, 255) 72%, rgb(255, 255, 255) 80%, rgb(222, 222, 255) 84%)",
                  }}
                ></span>
                <span>0.1 ETH</span>
              </div>
              <div className="eventSeatInfoBox">
                <span
                  style={{
                    background:
                      "linear-gradient(to right, rgb(191, 149, 63), rgb(252, 246, 186), #e3a214, rgb(251, 245, 183), rgb(170, 119, 28))",
                  }}
                ></span>
                <span>0.01 ETH</span>
              </div>
              <div className="eventSeatInfoBox">
                <span
                  style={{
                    background:
                      "linear-gradient(to right, rgb(222, 222, 222), rgb(255, 255, 255), rgb(222, 222, 222), rgb(255, 255, 255)",
                  }}
                ></span>
                <span>0.001 ETH</span>
              </div>
              <div className="eventSeatInfoBox">
                <span
                  style={{
                    background: "lime",
                  }}
                ></span>
                <span>Selected</span>
              </div>

              <div className="eventSeatInfoBox">
                <span
                  style={{
                    background: "#d9d9d9",
                  }}
                ></span>
                <span>Not Available</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {step === 1 && (
        <div className="eventStageRightSection">
          {
            <div className="eventStageStep1">
              {seats.length === 0 ? (
                <span>
                  Please select your seats. You can buy max 5 tickets.
                </span>
              ) : (
                seats.map((item, index) => {
                  return (
                    <div className="eventRightSectionInputBox">
                      <div className="eventRightSectionInputBoxHeader">
                        <span>
                          {index + 1}.Ticket | Seat {item.number} | {item.price}{" "}
                          ETH
                        </span>
                        <button onClick={() => useMyWallet(item.number)}>
                          Use My Wallet
                        </button>
                      </div>
                      <div className="eventRightSectionInputArea">
                        <input
                          type="text"
                          placeholder="Enter your wallet"
                          style={{
                            borderColor:
                              inputError(seats?.[index]?.wallet) &&
                              "var(--accent-color)",
                          }}
                          value={seats?.[index]?.wallet}
                          onChange={(e) =>
                            handleChangeWallets(item.number, e.target.value)
                          }
                        />
                        <p>{inputError(seats?.[index]?.wallet)}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          }
          <button className="buyBtn" onClick={handleNext}>
            Next
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="eventStageRightSection">
          <div className="eventStageStep2">
            <div className="eventStageStep2Title">Summary</div>

            {seats.map((item, index) => {
              return (
                <div className="eventStageStep2Item">
                  <span>
                    {index + 1}.Ticket | Seat {item.number}<br/>{item.price} ETH
                  </span>
                  <span title={item.wallet}>{item.wallet}</span>
                </div>
              );
            })}

            <div className="eventStageStep2Item">
              <span>Total Cost</span>
              <span>
                {seats?.reduce((acc, item) => {
                  return acc + item.price;
                }, 0)}{" "}
                ETH
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

export default ScreenContent;
