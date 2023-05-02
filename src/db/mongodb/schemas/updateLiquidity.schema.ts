import { Schema } from "mongoose";
import { ModelType } from "../mongo";

export const getUpdateLiquiditySchema = (): Schema => {
  const schema = new Schema(
    {
      tx: {
        type: String,
        required: true
      },
      block: {
        type: Number,
        required: true
      },
      timestamp: {
        type: Number,
        required: true
      },
      tokenId: {
        type: String,
        required: true
      },
      created_at: {
        type: Date,
        default: Date.now
      }
    },
    {
      collection: ModelType.updateLiquidity
    }
  );

  return schema;
};
