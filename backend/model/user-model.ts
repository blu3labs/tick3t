import {
    D1Orm,
    DataTypes,
    Model,
    GenerateQuery,
    QueryType,
    type Infer,
  } from "d1-orm";
  import { TABLE_NAMES } from "../config/table_names";
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
          title: {
            type: DataTypes.STRING,
          },
          category: {
            type: DataTypes.STRING,
          },
          date: {
            type: DataTypes.STRING,
          },
          location: {
            type: DataTypes.STRING,
          },
          image: {
            type: DataTypes.STRING,
          },
          type: {
            type: DataTypes.STRING,
          },
  
        }
      );
      
      type User = Infer<typeof user>;
      if (TABLE_NAMES.user === "") {
        const { meta: create } = await db
          .prepare(
            `CREATE TABLE ${user.tableName} (id integer primary key, 
              title text,
              category text,
              date text,
              location text,
              image text,
              type text
              );`
          )
          .run();
        (user.tableName as any) = create.txn!.name;
        console.log("created user table")
      } else {
        (user.tableName as any) = TABLE_NAMES.user;
      }
  
      return user;
    } catch (error) {
      console.log(error);
    }
  };
  