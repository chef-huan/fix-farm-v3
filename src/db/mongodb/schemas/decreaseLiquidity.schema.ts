import { Schema } from "mongoose";
import { ModelType } from "../mongo";

export const getDecreaseLiquiditySchema = (): Schema => {
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
      output_amount0: {
        type: String,
      },
      output_amount1: {
        type: String,
      },
      params: {
        type: String,
        required: true,
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
      collection: ModelType.decreaseLiquidity,
    }
  );

  schema.index({ tx: 1, user: 1, params: 1 }, { unique: true });

  return schema;
};
