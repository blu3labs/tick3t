import { ethers } from "ethers";
import { multichainRpc } from "./multichainRpc";

export const getEthBalance = async ({ address }) => {
  try {
    for (let i = 0; i < multichainRpc?.length; i++) {
      let provider = new ethers.providers.StaticJsonRpcProvider(
        multichainRpc[i]
      );
      try {
        const balance = provider.getBalance(address);
        let result_ = await Promise.resolve(balance).then((res) => {
          return res;
        });
        return result_;
      } catch (error) {
        console.log(`${multichainRpc[i]} failed to connect ${i}`);
      }
    }
  } catch (error) {
    console.log(error, "all rpc error");
    throw new Error(error);
  }
};
