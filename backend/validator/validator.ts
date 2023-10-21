import ethers from "ethers";
import { Contract } from "ethers";
import { parseUnits } from "ethers/lib/utils";
import * as dotenv from "dotenv";
dotenv.config();

const abi = [
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "owner",
            type: "address",
          },
          {
            internalType: "address",
            name: "collection",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "deadline",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "salt",
            type: "uint256",
          },
        ],
        internalType: "struct LibTicket.Ticket",
        name: "ticket",
        type: "tuple",
      },
      {
        internalType: "bytes",
        name: "signature",
        type: "bytes",
      },
    ],
    name: "use",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export async function ValidateTicket(
  owner: string,
  collection: string,
  tokenId: string,
  deadline: string,
  salt: string,
  signature: string
) {
  const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
  const privateKey = process.env.VALIDATOR_KEY || "";
  const wallet = new ethers.Wallet(privateKey, provider);
  const contract = new Contract(collection, abi, wallet);
  const tokenId_ = parseUnits(tokenId, 0);
  const deadline_ = parseUnits(deadline, 0);
  const salt_ = parseUnits(salt, 0);
  let signatureNotNull = signature !== ""
  try {
    const estimate = await contract.estimateGas.use(
      [
        owner,
        collection,
        tokenId_,
        deadline_,
        salt_,
      ],
      signatureNotNull ?  signature : []
    );
  } catch (error: any) {
    let message = error
      ? error.reason !== undefined
        ? error.reason?.includes("execution reverted")
          ? error.reason?.split("execution reverted:")[1]
          : error.reason
        : error.message !== undefined
        ? error.message === "Internal JSON-RPC error."
          ? "Insufficient Balance"
          : error.message
        : "Something went wrong"
      : "Something went wrong";
    return message;
  }
  try {
    const tx = await contract.use(
      [
        owner,
        collection,
        tokenId_,
        deadline_,
        salt_,
      ],
      signatureNotNull ?  signature : []
    );
    await tx.wait()
  } catch (error: any) {
    let message = error
      ? error.reason !== undefined
        ? error.reason?.includes("execution reverted")
          ? error.reason?.split("execution reverted:")[1]
          : error.reason
        : error.message !== undefined
        ? error.message === "Internal JSON-RPC error."
          ? "Insufficient Balance"
          : error.message
        : "Something went wrong"
      : "Something went wrong";
    return message;
  }
  return "Success!";
}
