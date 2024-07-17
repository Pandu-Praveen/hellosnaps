import { config } from "dotenv";
import { Sequelize } from "sequelize";

config();

const { DB_NAME, DB_USERNAME, DB_PASSWORD, DB_HOST, DB_PORT, DB_DIALECT } =
  process.env;

export const sequelize = new Sequelize(
  DB_NAME as string,
  DB_USERNAME as string,
  DB_PASSWORD,
  {
    dialect: "postgres",
    host: DB_HOST,
    port: DB_PORT ? +DB_PORT : 5432,
    dialectOptions:
      process.env.NODE_ENV == "development"
        ? {}
        : {
            ssl: false,
          },
    logging: false,
  },
);

const client = {
  connect: async (callback: (e: any) => void) => {
    try {
      await sequelize.authenticate();
      console.log(`Connected to DB ${DB_DIALECT || "Sqlite"}`);
      callback(null);
    } catch (err: any) {
      callback(err);
    }
  },
  sequelize,
};

export default client;
