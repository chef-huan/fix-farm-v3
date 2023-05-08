import { Schema } from "mongoose";
import { ModelType } from "../mongo";

export const getDecreaseLiquiditySchema = (): Schema => {
  const schema = new Schema(
    {
      block: {
        type: Number,
        required: true,
      },
      timestamp: {
        type: Number,
        required: true,
      },
      affected_original: {
        type: String,
        required: true,
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
