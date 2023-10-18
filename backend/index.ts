import * as dotenv from "dotenv";
dotenv.config();
import { Database } from "@tableland/sdk";
import { Wallet, ethers, getDefaultProvider } from "ethers";
import Baojs from "baojs"
import {
  tableland
} from "./config/db";
import { eventModel } from "./model/event-model";
import { userModel } from "./model/user-model";
const app = new Baojs()


tableland().then(async (res) => {
  const { orm, db } = res;
  const user = await userModel(orm!, db);
  const event = await eventModel(orm!, db);
  console.log("user", user);
  console.log("event", event);
})

app.listen({
  port:3019
})


console.log(`Listening on http://localhost:${3019} ...`);
