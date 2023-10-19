import {
  D1Orm,
  DataTypes,
  Model,
  GenerateQuery,
  QueryType,
  type Infer,
} from "d1-orm";
import { TABLE_NAMES } from "../config/table_names";

export interface userI {
  address: string;
  tickets: string;
}

export const userModel = async (orm: D1Orm, db: any) => {
  try {
    const user = new Model(
      {
        D1Orm: orm,
        tableName: "user",
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
        tickets: {
          type: DataTypes.STRING,
        },
      }
    );

    if (TABLE_NAMES.user === "") {
      const { meta: create } = await db
        .prepare(
          `CREATE TABLE ${user.tableName} (id integer primary key, 
              address text,
              tickets text
              );`
        )
        .run();

      (user.tableName as any) = create.txn!.name;
      console.log("created user table",create.txn!.name);
    } else {
      (user.tableName as any) = TABLE_NAMES.user;
    }
    return user;
  } catch (error) {
    console.log(error);
  }
};
