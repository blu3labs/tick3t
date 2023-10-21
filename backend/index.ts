import * as dotenv from "dotenv";
dotenv.config();
import { Database } from "@tableland/sdk";
import { Wallet, ethers, getDefaultProvider } from "ethers";

import { tableland } from "./config/db";
import { eventModel } from "./model/event-model";
import { qrModel } from "./model/qr-model";
import { ValidateTicket } from "./validator/validator";
import express from "express";
import cors from "cors";

const app: express.Application = express();
app.use(cors());
app.use(express.json());
const { orm, db } = await tableland();
if (!orm || !db) {
  app.use((req, res) => {
    res.json({ message: "Error on database connection" });
    return;
  });
}
const event = await eventModel(orm!, db);
const qr = await qrModel(orm!, db);

app.get("/event/:id", async (req, res) => {
  try {
    const address = req.params.id;
    const eventData = await event?.First({
      where: {
        address: ethers.utils.getAddress(address),
      },
    });
    if (!eventData) {
      res.json({
        status: 404,
        data: "Not Found",
      });
      return;
    }
    res.json({
      status: 200,
      data: eventData,
    });
  } catch (error) {
    console.log(error);
    res.json({
      status: 500,
      data: "Unexpected Error",
    });
  }
});

app.get("/all/events", async (req, res) => {
  try {
    const eventData = await event?.All({});
    // reverse the array

    res.json({
      status: 200,
      data: eventData,
    });
  } catch (error) {
    console.log(error);
    res.json({
      status: 500,
      data: "Unexpected Error",
    });
  }
});

app.post("/event", async (req, res) => {
  try {
    const body = req.body;
    const createEvent = await event?.InsertOne({
      address: body.address,
      title: body.title,
      category: body.category,
      date: body.date,
      venue: body.venue,
      image: body.image,
      description: body.description,
      venuePrice1: body.venuePrice1,
      venuePrice2: body.venuePrice2,
      venuePrice3: body.venuePrice3,
      chain: body.chain,
    });
    res.json({
      status: 200,
      data: "success",
    });
  } catch (error) {
    res.json({
      status: 500,
      data: "Unexpected Error",
    });
  }
});

app.post("/qr", async (req, res) => {
  try {
    const body = req.body;
    const createEvent = await qr?.InsertOne({
      hash: body.hash,
      signature: body.signature,
      owner: body.owner,
      collection: body.collection,
      tokenId: body.tokenId,
      amount: body.amount,
      deadline: body.deadline,
      salt: body.salt,
    });
    res.json({
      status: 200,
      data: "success",
    });
  } catch (error) {
    res.json({
      status: 500,
      data: "Unexpected Error",
    });
  }
});

app.get("/qr/:id", async (req, res) => {
  try {
    const hash = req.params.id;
    const qrData = await qr?.First({
      where: {
        hash: hash,
      },
    });
    res.json({
      status: 200,
      data: qrData,
    });
  } catch (error) {
    res.json({
      status: 500,
      data: "Unexpected Error",
    });
  }
});

app.get("/check/qr", async (req, res) => {
  try {
    const query = req.query;
    const msg = await ValidateTicket(
      query.owner as string,
      query.collection as string,
      query.tokenId as string,
      query.deadline as string,
      query.salt as string,
      query.signature as string
    );
    res.json({
      status: 200,
      data: msg,
    });
  } catch (error) {
    res.json({
      status: 500,
      data: "Unexpected Error",
    });
  }
});

app.listen(process.env.PORT || 3001, () => {
  console.log("server started");
});
