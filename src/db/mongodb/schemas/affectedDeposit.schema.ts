import { Schema } from "mongoose";
import { ModelType } from "../mongo";

export const getAffectedDepositSchema = (): Schema => {
  const schema = new Schema(
    {
      networkId: {
        type: Number,
        required: true,
      },
      externalId: {
        type: String,
        required: true,
      },
      fixed: {
        type: Boolean,
        required: true,
      },
      rewardTotal: {
        type: String,
        required: true,
      },
      rewardGrowthInside: {
        type: String,
        required: true,
      },
      originalDeposit: {
        type: String,
        required: true,
      },
      methodsCalled: {
        type: String,
        required: true,
      },
      methodsCalledCount: {
        type: Number,
        required: true,
      },
      lastMethodCheckedBlock: {
        type: Number,
        required: true,
      },
      fixMethodCallIndex: {
        type: Number,
        required: true,
      },
      timestamp: {
        type: Number,
        required: true,
      },
      created_at: {
        type: Date,
        default: Date.now,
      },
    },
    {
      collection: ModelType.affectedDeposit,
    }
  );

  schema.index({ externalId: 1, networkId: 1 }, { unique: true });

  return schema;
};
