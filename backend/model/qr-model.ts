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
          tickets: {
            type: DataTypes.STRING,
          },
        }
      );
  
      if (TABLE_NAMES.qr === "") {
        const { meta: create } = await db
          .prepare(
            `CREATE TABLE ${qr.tableName} (id integer primary key, 
                signature text,
                tickets text
                );`
          )
          .run();
  
        (qr.tableName as any) = create.txn!.name;
        console.log("created qr table",create.txn!.name);
      } else {
        (qr.tableName as any) = TABLE_NAMES.qr;
      }
      return qr;
    } catch (error) {
      console.log(error);
    }
  };
  