import { Contract } from "@ethersproject/contracts";
import safeProxyAbi from "./abis/safeProxyABI.json";
import safeAbi from "./abis/safe.json";
import { Signer } from "@ethersproject/abstract-signer";
import { BigNumber, ethers } from "ethers";

export interface Tick3tTransaction {
  to: string;
  value: string;
  data: string;
  operation?: number;
  safeTxGas?: string;
  baseGas?: string;
  gasPrice?: string;
  gasToken?: string;
  refundReceiver?: string;
  nonce?: number;
  signatures?: string;
  from: string;
}

export const setupCallData = (tx: Tick3tTransaction, signer: Signer) => {
  const data = tx.data;
  const owner = tx.from;
  const safesingleton = getSafeContract(
    "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552",
    signer
  );

  // const fallbackHandlerAddress = "0xf48f2B2d2a534e402487b3ee7C18c33Aec0Fe5e4"
  const Zero = ethers.constants.AddressZero;

  return safesingleton.interface.encodeFunctionData("setup", [
    [owner],
    1,
    Zero,
    data,
    "0xf48f2B2d2a534e402487b3ee7C18c33Aec0Fe5e4",
    Zero,
    0,
    Zero,
  ]);
};

export const getEncodedTransaction = async (
  safeTransaction: Tick3tTransaction,
  signer: Signer
): Promise<string> => {
  const safeSingletonContract = getSafeProxyFactoryContract(signer);

  const setupCall = setupCallData(safeTransaction, signer);
  const encodedTransaction: string =
    safeSingletonContract.interface.encodeFunctionData("createProxyWithNonce", [
      "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552", // singleton,
      setupCall,
      BigNumber.from(Date.now()).toNumber(),
    ]) as string;

  return encodedTransaction;
};


// For goerli Testnet.
export const getSafeProxyFactoryContract = (signer: Signer): Contract => {
  const address: string = "0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2";
  const ABI = safeProxyAbi;
  if (signer) {
    return new Contract(address, ABI, signer);
  } else {
    console.log("errro");
    throw "No signer provided";
  }
};

export const getSafeContract = (address: string, signer: Signer): Contract => {
  const ABI = safeAbi;

  if (signer) {
    return new Contract(address, ABI, signer);
  } else {
    throw "No signer provided";
  }
};
