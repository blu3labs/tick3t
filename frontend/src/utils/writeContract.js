import { ethers } from "ethers";
import { toast } from "react-hot-toast";

export const writeContract = async (data) => {
  const loadToast = toast.loading("Transaction processing...");

  try {
    const {
      address,
      abi,
      method,
      message,
      args,
      val,
      signer,
      chainId,
      safeAuthSignInResponse,
      dispatch,
      setChainId,
    } = data;

    if (signer == null || safeAuthSignInResponse === null) {
      toast.error("Please connect your wallet");
      toast.dismiss(loadToast);
      return "err";
    }

    if (5 != chainId) {
      toast.error("Please switch to the correct network");

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
        return "err";
      }

      toast.dismiss(loadToast);
      return "err";
    }

    const contract = new ethers.Contract(address, abi, signer);

    let val_ = val;
    if (!val_) {
      val_ = ethers.utils.parseUnits("0", 0);
    }

    let args_ = args;
    if (!args_) {
      args_ = [];
    }

    const tx = await contract[method](...args_, {
      value: val_,
    });

    const receipt = await tx.wait();
    toast.success(message ?? "Transaction successful");
    toast.dismiss(loadToast);

    return receipt;
  } catch (error) {
    console.log(error);
    toast.error(
      error
        ? error.reason !== undefined
          ? error.reason?.includes("execution reverted")
            ? error.reason?.split("execution reverted:")[1]
            : error.reason
          : error.message !== undefined
          ? error.message === "Internal JSON-RPC error."
            ? "Insufficient Balance"
            : error.message
          : "Something went wrong"
        : "Something went wrong"
    );
    toast.dismiss(loadToast);
    return "err";
  }
};
