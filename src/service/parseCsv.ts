import path from "path";
import * as fs from "fs";
import { parse, Callback, CastingFunction } from "csv-parse";
import { IncreaseLiquidityFunction } from "../model/farmFunctions";

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

export const parseCsv = (pathToFile: string) => {
  const headers = [
    "tx",
    "timestamp",
    "block",
    "output_amount0",
    "output_amount1",
    "output_liquidity",
    "params",
  ];

  const callback: Callback = (error, result: IncreaseLiquidityFunction[]) => {
    if (error) {
      console.error(error);
    }

    console.log("Result", result[0].timestamp);
  };

  commonParseCsv(pathToFile, headers, callback);
};
