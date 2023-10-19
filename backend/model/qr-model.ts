import {
  D1Orm,
  DataTypes,
  Model,
  GenerateQuery,
  QueryType,
  type Infer,
} from "d1-orm";
import { TABLE_NAMES } from "../config/table_names";

export const qrModel = async (orm: D1Orm, db: any) => {
  try {
    const qr = new Model(
      {
        D1Orm: orm,
        tableName: "qr",
        primaryKeys: "id",
        autoIncrement: "id",
      },
      {
        id: {
          type: DataTypes.INTEGER,
          notNull: true,
        },
        signature: {
          type: DataTypes.STRING,
        },
        owner: {
          type: DataTypes.STRING,
        },
        collection: {
          type: DataTypes.STRING,
        },
        tokenId: {
          type: DataTypes.STRING,
        },
        amount: {
          type: DataTypes.STRING,
        },
        deadline: {
          type: DataTypes.STRING,
        },
        salt: {
          type: DataTypes.STRING,
        },
      }
    );

    if (TABLE_NAMES.qr === "") {
      const { meta: create } = await db
        .prepare(
          `CREATE TABLE ${qr.tableName} (id integer primary key, 
                signature text,
                owner text,
                collection text,
                tokenId text,
                amount text,
                deadline text,
                salt text
                );`
        )
        .run();

      (qr.tableName as any) = create.txn!.name;
      console.log("created qr table", create.txn!.name);
    } else {
      (qr.tableName as any) = TABLE_NAMES.qr;
    }
    return qr;
  } catch (error) {
    console.log(error);
  }
};
