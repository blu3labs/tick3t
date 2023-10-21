import Safe, {
  EthersAdapter,
  getSafeContract,
} from "@safe-global/protocol-kit";
import axios from "axios";
import { BigNumber, ethers } from "ethers";
import { hexlify } from "ethers/lib/utils";
import { toast } from "react-hot-toast";
import { BUNDLER_API_URL } from "./apiUrls";
import { GelatoRelayPack } from "@safe-global/relay-kit";

export const writeContractAbstract = async (data) => {
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
      abstractAccountAddress,
      safeAuthSignInResponse,
      dispatch,
      web3AuthModalPack,
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

    const callData = contract.interface.encodeFunctionData(method, args);

    const ethAdapter = new EthersAdapter({
      ethers,
      signerOrProvider: signer,
    });

    const safeSDK = await Safe.create({
      ethAdapter,
      safeAddress: abstractAccountAddress,
    });
    const safeContract = getSafeContract({
      ethAdapter,
      safeVersion: "1.3.0",
      customSafeAddress: abstractAccountAddress,
    });
    const isOwner = await (
      await safeContract
    ).isOwner(await signer.getAddress());

    if (!isOwner) {
    

      toast.error("You're not owner of the smart account.");

      toast.dismiss(loadToast);
      return "err";


    }
    const callInformation = {
      to: contract.address,
      value: BigNumber.from(val_).toString(),
      data: callData,
      operation: 0,
    };

    console.log(callInformation, "iso 1");

    const relayKit = new GelatoRelayPack(
      "_mhz0rzLWDbZ6_qEdg9c5qF50kgQ_XuKOlTFxXVdIbg_"
    );

    const normalTx = await relayKit.createRelayedTransaction({
      safe: safeSDK,
      transactions: [
        {
          data: callInformation.data,
          to: callInformation.to,
          value: callInformation.value,
          operation: callInformation.operation,
        },
      ],
    });

    console.log(normalTx, "iso 2");

    normalTx.data.refundReceiver = ethers.constants.AddressZero;
    normalTx.data.gasPrice = "0";

    const providerTest = new ethers.providers.Web3Provider(
      web3AuthModalPack?.getProvider()
    );

    let signedVersion = {};
    const hash = await safeSDK.getTransactionHash(normalTx);
    let signatureData = "";

    console.log(hash, "iso 3");

    try {
      signatureData = await providerTest.send("eth_sign", [
        (await signer.getAddress()).toLowerCase(),
        hexlify(hash),
      ]);

      signedVersion = normalTx;
      //   signedVersion = await safeSDK.signTransaction(normalTx)
    } catch (err) {
      signedVersion = await safeSDK.signTransaction(normalTx);
      signatureData = signedVersion.encodedSignatures();
    }

    const responsebundler = await axios.post(
      BUNDLER_API_URL + "/send-tx",
      JSON.stringify({
        ...signedVersion.data,
        signature: signatureData,
        address: abstractAccountAddress,
      })
    );

    console.log(responsebundler, "iso 4");
    // const receipt = await tx.wait();


    if (
      responsebundler?.data?.error &&
      typeof responsebundler?.data?.error === "object"
    ) {
      toast.error(
        responsebundler?.data?.error
          ? responsebundler?.data?.error.reason !== undefined
            ? responsebundler?.data?.error.reason?.includes(
                "execution reverted"
              )
              ? responsebundler?.data?.error.reason?.split(
                  "execution reverted:"
                )[1]
              : responsebundler?.data?.error.reason
            : responsebundler?.data?.error.message !== undefined
            ? responsebundler?.data?.error.message ===
              "Internal JSON-RPC error."
              ? "Insufficient Balance"
              : responsebundler?.data?.error.message
            : "Something went wrong"
          : "Something went wrong"
      );
      toast.dismiss(loadToast);
      return "err";
    }


    toast.success(message ?? "Transaction successful");
    toast.dismiss(loadToast);
    return responsebundler?.data;
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
