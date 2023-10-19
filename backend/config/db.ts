import {
  D1Orm,
  DataTypes,
  Model,
  GenerateQuery,
  QueryType,
  type Infer,
} from "d1-orm";
import { NonceManager } from "@ethersproject/experimental";
import { Database } from "@tableland/sdk";
import { Wallet, ethers } from "ethers";

export const tableland = async ():Promise<{ orm: D1Orm | undefined,  db: Database | undefined}> => {
  try {
    const privateKey = process.env.KEY || "";
    const provider = new ethers.providers.JsonRpcProvider(
      "https://arbitrum-goerli.blockpi.network/v1/rpc/public"
    );
    const baseSigner = new ethers.Wallet(privateKey, provider);
    const signer = new NonceManager(baseSigner);

    const db = new Database({ signer, autoWait: true });
    const orm = new D1Orm(db);
    return { orm, db };
  } catch (error) {
    console.log(error);
  }
  return {orm: undefined, db: undefined}
};
