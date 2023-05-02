import mongoose, { Connection, ConnectOptions, Model } from "mongoose";
import { getUpdateLiquiditySchema } from "./schemas/updateLiquidity.schema";
import { getIncreaseLiquiditySchema } from "./schemas/increaseLiquidity.schema";
import { getDecreaseLiquiditySchema } from "./schemas/decreaseLiquidity.schema";
import { getWithdrawSchema } from "./schemas/withdraw.schema";

let connection: Connection | null = null;

/**
 * @see https://vercel.com/guides/deploying-a-mongodb-powered-api-with-node-and-vercel
 * @see https://mongoosejs.com/docs/lambda.html
 */

export enum ModelType {
  updateLiquidity = "updateLiquidity",
  increaseLiquidity = "increaseLiquidity",
  decreaseLiquidity = "decreaseLiquidity",
  withdraw = "withdraw",
}

export const getConnection = async (): Promise<Connection> => {
  if (connection === null) {
    /* istanbul ignore next */
    const uri =
      process.env.MONGO_URI ?? "mongodb://localhost:27017/farm-issue-v3";
    const options: ConnectOptions = {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
      // useCreateIndex: true,
      bufferCommands: false,
      autoIndex: true,
      autoCreate: false,
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000,
      // bufferMaxEntries: 0
    };
    mongoose.set("strictQuery", true);
    connection = await mongoose.createConnection(uri, options).asPromise();

    connection.model(ModelType.increaseLiquidity, getIncreaseLiquiditySchema());
    connection.model(ModelType.decreaseLiquidity, getDecreaseLiquiditySchema());
    connection.model(ModelType.updateLiquidity, getUpdateLiquiditySchema());
    connection.model(ModelType.withdraw, getWithdrawSchema());
  }

  return connection;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getModel = async (type: ModelType): Promise<Model<any>> => {
  connection = await getConnection();

  return connection.model(type);
};
