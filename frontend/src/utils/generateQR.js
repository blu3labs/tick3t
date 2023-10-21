import { _TypedDataEncoder, hashMessage } from "ethers/lib/utils";
import signAbi from "@/contract/signlib.json";
import { Contract } from "@ethersproject/contracts";
import axios from "axios";
import { GelatoRelayPack } from "@safe-global/relay-kit";
import Safe, { EthersAdapter } from "@safe-global/protocol-kit";
import { BACKEND_API_URL, BUNDLER_API_URL } from "./apiUrls";
import toast from "react-hot-toast";
import { ethers } from "ethers";

const types = {
  Ticket: [
    { name: "owner", type: "address" },
    { name: "collection", type: "address" },
    { name: "tokenId", type: "uint256" },
    { name: "deadline", type: "uint256" },
    { name: "salt", type: "uint256" },
  ]
};

async function getDomain(ticketInfo) {
  return {
    name: ticketInfo.title,
    version: "1",
    chainId: "5",
    verifyingContract: ticketInfo.collection,
  };
}

async function getValues(ticketInfo) {
  const values = {
    owner: ticketInfo.owner,
    collection: ticketInfo.collection,
    tokenId: ticketInfo.tokenId,
    deadline: ticketInfo.deadline,
    salt: ticketInfo.salt,
  };
  return values;
}
export async function SignTyped(ticketInfo, wallet) {
    const domain = await getDomain(ticketInfo);
    const value = await getValues(ticketInfo);
    const signature = await wallet._signTypedData(domain, types, value);
    return signature;
}
  

export const EIP712_SAFE_MESSAGE_TYPE = {
  // "SafeMessage(bytes message)"
  SafeMessage: [{ type: "bytes", name: "message" }],
};
export const calculateSafeMessageHash = (hashedValue, safeAddress, chainId) => {
  return _TypedDataEncoder.hash(
    { verifyingContract: safeAddress, chainId },
    EIP712_SAFE_MESSAGE_TYPE,
    { message: hashedValue }
  );
};
export const generateQRCode = async (
  ticketInfo,
  smartAccAddress,
  signer,
  isAbstract
) => {


  const ethAdapter  = new EthersAdapter({
    signerOrProvider:signer,
    ethers
  })

  const hashedValue = hashMessage(JSON.stringify({...ticketInfo}));

  let safeHash = calculateSafeMessageHash(hashedValue, smartAccAddress, 5);
  if (!isAbstract) {
    try {


      safeHash =   calculateSafeMessageHash(hashedValue,  ticketInfo.collection , 5);
      const signature = await SignTyped(ticketInfo, signer)
      await axios.post(BACKEND_API_URL + "/qr", {
        owner: ticketInfo.owner,
        collection: ticketInfo.collection,
        tokenId: ticketInfo.tokenId,
        amount: ticketInfo.amount,
        deadline: ticketInfo.deadline,
        salt: ticketInfo.salt,
        hash: hashedValue,
        signature,
      });
      return signature;
    } catch (err) {
      console.log(err);
      toast.error("Error while generating QR code");
      return "err";
    }
  }

  const relayKit = new GelatoRelayPack(
    "_mhz0rzLWDbZ6_qEdg9c5qF50kgQ_XuKOlTFxXVdIbg_"
  );
  const safeSDK = Safe.create({
    ethAdapter,
    safeAddress: smartAccAddress,
  });
  try {
    await signMessageTransaction(safeSDK, ethAdapter, hashedValue, relayKit);
    // send the hash and the object value to backend to store the values.
    await axios.post(BACKEND_API_URL + "/qr", {
      ...ticketInfo,
      hash: hashedValue,
    });

    return "";
  } catch (err) {
    console.log(err);
    toast.error("Error while generating QR code");
    return "err";
  }
};

export const signMessageTransaction = async (
  safeSDK,
  ethAdapter,
  value,
  relayKit
) => {
  const signatureLib = new Contract(
    "0xA65387F16B013cf2Af4605Ad8aA5ec25a2cbA3a2",
    signAbi,
    ethAdapter.getSigner()
  );
  const callInside = signatureLib.interface.encodeFunctionData("signMessage", [
    value,
  ]);
  const txCallInside = await safeSDK.createTransaction({
    safeTransactionData: {
      data: callInside,
      to: signatureLib.address,
      operation: 1,
      value: "0",
    },
    onlyCalls: true,
  });
  const safeSignTxRelayInside = await relayKit.createRelayedTransaction({
    safe: safeSDK,
    transactions: [
      {
        to: txCallInside.data.to,
        data: txCallInside.data.data,
        operation: 1,
        value: txCallInside.data.value,
      },
    ],
  });
  const signedVersionInside = await safeSDK.signTransaction(
    safeSignTxRelayInside
  );
  const tx = await axios.post(
    BUNDLER_API_URL + "/send-tx",
    JSON.stringify({
      ...signedVersionInside.data,
      value: "0",
      signature: signedVersionInside.encodedSignatures(),
      address: await safeSDK.getAddress(),
    })
  );
  if (tx.status === 200) {
    console.log(
      "QR Code generated for the hash ",
      value,
      " for the smart account ",
      await safeSDK.getAddress()
    );
    return value;
  }
}
