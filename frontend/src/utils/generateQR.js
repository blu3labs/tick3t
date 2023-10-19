import { _TypedDataEncoder, hashMessage } from "ethers/lib/utils";

import signAbi from "./abis/signlib.json";
import { Contract } from "@ethersproject/contracts";
import axios from "axios";
import { GelatoRelayPack } from "@safe-global/relay-kit";
import Safe from "@safe-global/protocol-kit";
import { BACKEND_API_URL, BUNDLER_API_URL } from "./apiUrls";

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
  ethAdapter,
  callbackOnError
) => {
  const hashedValue = hashMessage(ticketInfo);
  const safeHash = calculateSafeMessageHash(hashedValue, smartAccAddress, 5);
  const relayKit = new GelatoRelayPack(
    "_mhz0rzLWDbZ6_qEdg9c5qF50kgQ_XuKOlTFxXVdIbg_"
  );
  const safeSDK = Safe.create({
    ethAdapter,
    safeAddress: smartAccAddress,
  });

  try {
    await signMessageTransaction(safeSDK, ethAdapter, safeHash, relayKit);
    // send the hash and the object value to backend to store the values.
    await axios.post(BACKEND_API_URL + "/qr", {
      ...ticketInfo,
      hash: safeHash,
    });
  } catch (err) {
    console.log(err);
    callbackOnError(err);
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
};
