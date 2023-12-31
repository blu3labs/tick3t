import {
  D1Orm,
  DataTypes,
  Model,
  GenerateQuery,
  QueryType,
  type Infer,
} from "d1-orm";
import { TABLE_NAMES } from "../config/table_names";
export const eventModel = async (orm: D1Orm, db: any) => {
  try {
    const event = new Model(
      {
        D1Orm: orm,
        tableName: "event",
        primaryKeys: "id",
        autoIncrement: "id",
      },
      {
        id: {
          type: DataTypes.INTEGER,
          notNull: true,
        },
        address: {
          type: DataTypes.STRING,
        },
        title: {
          type: DataTypes.STRING,
        },
        description: {
          type: DataTypes.STRING,
        },
        category: {
          type: DataTypes.STRING,
        },
        date: {
          type: DataTypes.STRING,
        },
        venue: {
          type: DataTypes.STRING,
        },
        image: {
          type: DataTypes.STRING,
        },
        venuePrice1: {
          type: DataTypes.STRING,
        },
        venuePrice2: {
          type: DataTypes.STRING,
        },
        venuePrice3: {
          type: DataTypes.STRING,
        },
        chain: {
          type: DataTypes.STRING,
        },
      }
    );

    type Event = Infer<typeof event>;
    if (TABLE_NAMES.event === "") {
      const { meta: create } = await db
        .prepare(
          `CREATE TABLE ${event.tableName} (id integer primary key, 
            address text,
            title text,
            description text,
            category text,
            date text,
            venue text,
            image text,
            venuePrice1 text,
            venuePrice2 text,
            venuePrice3 text,
            chain text
            );`
        )
        .run();

      (event.tableName as any) = create.txn!.name;
      console.log("created event table", create.txn!.name);
    } else {
      (event.tableName as any) = TABLE_NAMES.event;
    }

    return event;
  } catch (error) {
    console.log(error);
  }
};
