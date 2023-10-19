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
const event = await eventModel(orm!, db);
const qr = await qrModel(orm!, db);

app.get("/event/:id", async (req, res) => {
  const address = req.params.id;
  const eventData = await event?.First({
    where: {
      address: address,
    },
  });
  res.json({
    status: 200,
    data: eventData,
  });
});

app.get("/all/events/:category", async (req, res) => {
  const category = req.params.category;

  if (category === "all") {
    const eventData = await event?.All({});
    res.json({
      status: 200,
      data: eventData,
    });
    return;
  }
  const eventData = await event?.All({
    where: {
      category: category,
    },
  });
  res.json({
    status: 200,
    data: eventData,
  });
});

app.post("/event", async (req, res) => {
  const body = req.body;
  const createEvent = await event?.InsertOne({
    address: body.address,
    title: body.title,
    category: body.category,
    date: body.date,
    venue: body.location,
    image: body.image,
    venuePrice1: body.venuePrice1,
    venuePrice2: body.venuePrice2,
    venuePrice3: body.venuePrice3,
    chain: body.chain,
  });
  res.json({
    status: 200,
    data: "success",
  });
});

app.post("/qr", async (req, res) => {
  const body = req.body;
  const createEvent = await qr?.InsertOne({
    hash: body.hash,
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
});

app.get("/qr/:id", async (req, res) => {
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
});

app.post("/check/qr", async (req, res) => {
  const body = req.body;
  const [msg] = await ValidateTicket(
    body.owner,
    body.collection,
    body.tokenId,
    body.deadline,
    body.salt,
    body.hash
  );
  res.json({
    status: 200,
    data: msg,
  });
});

app.listen(3001, () => {
  console.log("server started");
});
