import { Schema } from "mongoose";
import { ModelType } from "../mongo";

export const getWithdrawSchema = (): Schema => {
  const schema = new Schema(
    {
      tx: {
        type: String,
        required: true,
      },
      block: {
        type: Number,
        required: true,
      },
      timestamp: {
        type: Number,
        required: true,
      },
      to: {
        type: String,
        required: true,
      },
      tokenId: {
        type: String,
        required: true,
      },
      output_reward: {
        type: String,
      },
      user: {
        type: String,
        required: true,
      },
      created_at: {
        type: Date,
        default: Date.now,
      },
    },
    {
      collection: ModelType.withdraw,
    }
  );

  schema.index(
    { tx: 1, to: 1, tokenId: 1, output_reward: 1 },
    { unique: true }
  );

  return schema;
};
