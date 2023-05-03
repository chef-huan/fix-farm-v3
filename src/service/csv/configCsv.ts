import { ModelType } from "../../db/mongodb/mongo";

export const configMap = new Map<
  string,
  { pathToFile: string; headers: string[] }
>();

configMap.set(ModelType.updateLiquidity, {
  pathToFile: "input/bsc/updateLiquidityFunctionCall.csv",
  headers: ["tx", "timestamp", "block", "tokenId"],
});

configMap.set(ModelType.increaseLiquidity, {
  pathToFile: "input/bsc/increaseLiquidityFunctionCall.csv",
  headers: [
    "tx",
    "timestamp",
    "block",
    "output_amount0",
    "output_amount1",
    "output_liquidity",
    "params",
  ],
});

configMap.set(ModelType.decreaseLiquidity, {
  pathToFile: "input/bsc/decreaseLiquidityFunctionCall.csv",
  headers: [
    "tx",
    "timestamp",
    "block",
    "output_amount0",
    "output_amount1",
    "params",
  ],
});

configMap.set(ModelType.withdraw, {
  pathToFile: "input/bsc/withdrawFunctionCall.csv",
  headers: ["tx", "timestamp", "block", "to", "tokenId", "output_reward"],
});

configMap.set(ModelType.harvest, {
  pathToFile: "input/bsc/harvestFunctionCall.csv",
  headers: ["tx", "timestamp", "block", "to", "tokenId", "output_reward"],
});
