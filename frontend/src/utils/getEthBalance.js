import { ethers } from "ethers";
import { multiRpc } from "./multiRpc";

export const getEthBalance = async ({ address }) => {
  try {
    for (let i = 0; i < multiRpc?.length; i++) {
      let provider = new ethers.providers.StaticJsonRpcProvider(
        multiRpc[i]
      );
      try {
        const balance = provider.getBalance(address);
        let result_ = await Promise.resolve(balance).then((res) => {
          return res;
        });
        return result_;
      } catch (error) {
        console.log(`${multiRpc[i]} failed to connect ${i}`);
      }
    }
  } catch (error) {
    console.log(error, "all rpc error");
    throw new Error(error);
  }
};
