import {
    JsonRpcProvider
  } from "@ethersproject/providers";
import Bao from "baojs";
import { BigNumber, Contract, ethers } from "ethers";


const PRIVATE_KEY = process.env.PRIVATE_KEY || "";
const provider = new JsonRpcProvider(
  "https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"
);
const globalBundlerSigner = new ethers.Wallet(PRIVATE_KEY, provider);

const app = new Bao();


app.listen({
    port: parseInt(process.env.PORT!) || 3000,
  });
  