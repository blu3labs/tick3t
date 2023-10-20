import React, { useEffect, useState } from "react";
import { getEthBalance } from "@/utils/getEthBalance";
import { AiOutlineCopy } from "react-icons/ai";
import { toast } from "react-hot-toast";
import "../index.css";

function AbstractAccount({
  item,
  index,
  activeAddress,
  handleSwitchAbstractAccount,
}) {
  const [balance, setBalance] = useState(0);

  const getBalance = async () => {
    try {
      let res = await getEthBalance({ address: item });
      setBalance(res);
    } catch (err) {
      console.log(err);
      setBalance(0);
    }
  };

  useEffect(() => {
    getBalance();
  }, [item]);

  return (
    <div className="smartAccountModalListItemWrapper" key={index}>
      <div
        className="smartAccountModalListItem"
        onClick={() => handleSwitchAbstractAccount(item)}
        style={{
          background:
            activeAddress?.toLowerCase() === item?.toLowerCase() &&
            "var(--accent-color)",
          color:
            activeAddress?.toLowerCase() === item?.toLowerCase() && "white",
        }}
      >
        <div className="smartAccountModalListItemAddress">{item}</div>
        <div className="smartAccountModalListItemBalance">
          {parseFloat(balance?.toString(10) / 10 ** 18).toLocaleString(
            "en-US",
            {
              maximumFractionDigits: 6,
            }
          )}{" "}
          ETH
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
  );
}

export default AbstractAccount;
