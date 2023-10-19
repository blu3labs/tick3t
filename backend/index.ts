import * as dotenv from "dotenv";
dotenv.config();
import { Database } from "@tableland/sdk";
import { Wallet, ethers, getDefaultProvider } from "ethers";
import Baojs from "baojs";
import { tableland } from "./config/db";
import { eventModel } from "./model/event-model";
import { userModel, userI } from "./model/user-model";
import { EventBodyRequestData, UserBodyRequestData } from "./types";
import express from "express";
import cors from "cors";
const app: express.Application = express();
app.use(cors());
app.use(express.json());
const { orm, db } = await tableland();
const user = await userModel(orm!, db);
const event = await eventModel(orm!, db);

app.get("/user/:id", async (req, res) => {
  const address = req.params.id;
  const userData = await user?.First({
    where: {
      address: address,
    },
  });
  res.json({
    status: 200,
    data: userData,
  });
});

app.post("/user", async (req, res) => {
  const body: UserBodyRequestData = req.body;
  for (let i in body.addresses) {
    const checkUser = await user?.First({
      where: {
        address: body.addresses[i].address,
      },
    });
    if (checkUser) {
      let addTickets = checkUser.tickets + "," + body.addresses[i].ticket;
      const updateTickets = await user?.Update({
        where: {
          address: body.addresses[i].address,
        },
        data: {
          tickets: addTickets,
        },
      });
    }

    const createUser = await user?.InsertOne({
      address: body.addresses[i].address,
      tickets: body.addresses[i].ticket,
    });
  }
  res.json({
    status: 200,
    data: "success",
  });
});

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
    location: body.location,
    image: body.image,
    type: body.type,
  });
  res.json({
    status: 200,
    data: "success",
  });
});

app.get("/test", async (req, res) => {
  res.json({
    status: 200,
    data: "success",
  });
});

app.listen(3001, () => {
  console.log("server started");
});
