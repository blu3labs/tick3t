import { Database } from "@tableland/sdk";
import { Wallet, getDefaultProvider } from "ethers";

const privateKey = process.env.KEY || "";
console.log(`Using private key: ${privateKey}`);
const wallet = new Wallet(privateKey);

const provider = getDefaultProvider("http://127.0.0.1:8545");
const signer = wallet.connect(provider);

const db = new Database({signer});
