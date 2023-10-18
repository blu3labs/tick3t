import * as dotenv from "dotenv";
dotenv.config();
import { Database } from "@tableland/sdk";
import { Wallet, ethers, getDefaultProvider } from "ethers";
import Baojs from "baojs";
import { tableland } from "./config/db";
import { eventModel } from "./model/event-model";
import { userModel, userI } from "./model/user-model";
const app = new Baojs();


async function main() {
  try {
    const { orm, db } = await tableland();
    const user = await userModel(orm!, db);
    const event = await eventModel(orm!, db);
    app.get("/user/:id", async (ctx) => {
      const address = ctx.params.id;
      const userData = await user?.First({
        where: {
          address: address,
        },
      });
      return ctx.sendPrettyJson({
        status: 200,
        data: userData,
      });
    });

    app.post("/user", async (ctx) => {
      const body = ctx.req.json();

      const checkUser = await user?.First({
        where: {
          address: body.address,
        },
      });
      if (checkUser) {
        let addTickets = checkUser.tickets;
      }
      return ctx.sendPrettyJson({
        status: 200,
      });
    });

    app.get("/event/:id", async (ctx) => {
      const id = ctx.params.id;
      const eventData = await event?.First({
        where: {
          id: id,
        },
      });
      return ctx.sendPrettyJson({
        status: 200,
        data: eventData,
      });
    });

    app.get("/all/events/:category", async (ctx) => {
      const category = ctx.params.category;
      const eventData = await event?.Find({
        where: {
          category: category,
        },
      });


      return ctx.sendPrettyJson({
        status: 200,
        data: eventData,
      });
    });

    app.post("/event", async (ctx) => {
      const body = ctx.req.json();
      const createEvent = await event?.InsertOne({
        address: body.address,
        title: body.title,
        category: body.category,
        date: body.date,
        location: body.location,
        image: body.image,
        type: body.type,
      });
      return ctx.sendPrettyJson({
        status: 200,
        data: createEvent,
      });
    });

    app.listen({
      port: 3019,
    });
  } catch (error) {
    console.log(error);
  }
}

main().then(() => {
  console.log(`Listening on http://localhost:${3019} ...`);
});
