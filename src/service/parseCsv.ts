import path from "path";
import * as fs from "fs";
import { parse, Callback, CastingFunction } from "csv-parse";
import { IncreaseLiquidityFunction } from "../model/farmFunctions";
import { getModel, ModelType } from "../db/mongodb/mongo";

const defaultCast: CastingFunction = (columnValue, context) => {
  if (context.column === "timestamp") {
    const data = new Date(columnValue);
    return data.getTime() / 1000;
  }
  return columnValue;
};

const commonParseCsv = (
  pathToFile: string,
  headers: string[],
  callback: Callback,
  cast?: CastingFunction
) => {
  const csvFilePath = path.resolve(pathToFile);
  const fileContent = fs.readFileSync(csvFilePath, { encoding: "utf-8" });

  parse(
    fileContent,
    {
      delimiter: ",",
      columns: headers,
      fromLine: 2,
      cast: cast || defaultCast,
    },
    callback
  );
};

export const storeParsedIncreaseLiquidityCsv = async () => {
  const pathToFile = "input/bsc/increaseLiquidityFunctionCall.csv";
  const headers = [
    "tx",
    "timestamp",
    "block",
    "output_amount0",
    "output_amount1",
    "output_liquidity",
    "params",
  ];

  const callback: Callback = async (
    error,
    result: IncreaseLiquidityFunction[]
  ) => {
    if (error) {
      console.error(error);
    }

    const ilModel = await getModel(ModelType.increaseLiquidity);

    for (const callData of result) {
      try {
        if (!callData.output_amount0) {
          console.log("here", callData.tx, callData.output_amount0);
        }
        await ilModel.create(callData);
      } catch (e) {
        if (e instanceof Error) {
          console.error(e.message);
        }
      }
    }

    console.log("Result", result[0].timestamp);
  };

  commonParseCsv(pathToFile, headers, callback);
};
