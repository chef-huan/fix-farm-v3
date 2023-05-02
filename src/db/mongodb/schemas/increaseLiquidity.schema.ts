import { Schema } from "mongoose";
import { ModelType } from "../mongo";

export const getIncreaseLiquiditySchema = (): Schema => {
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
      tokenId: {
        type: String,
        required: true,
      },
      output_amount0: {
        type: String,
        required: true,
      },
      output_amount1: {
        type: String,
        required: true,
      },
      output_liquidity: {
        type: String,
        required: true,
      },
      params: {
        type: String,
        required: true,
      },
      created_at: {
        type: Date,
        default: Date.now,
      },
    },
    {
      collection: ModelType.increaseLiquidity,
    }
  );

  return schema;
};
