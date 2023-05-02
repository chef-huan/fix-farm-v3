import path from "path";
import * as fs from "fs";
import { parse, CastingFunction, Parser } from "csv-parse";
import { getModel, ModelType } from "../db/mongodb/mongo";

const defaultCast: CastingFunction = (columnValue, context) => {
  if (context.column === "timestamp") {
    const data = new Date(columnValue);
    return data.getTime() / 1000;
  }
  return columnValue;
};

const getCommonParser = async (
  pathToFile: string,
  headers: string[],
  cast?: CastingFunction
): Promise<Parser> => {
  const csvFilePath = path.resolve(pathToFile);
  const fileContent = fs.readFileSync(csvFilePath, { encoding: "utf-8" });

  return parse(fileContent, {
    delimiter: ",",
    columns: headers,
    fromLine: 2,
    cast: cast || defaultCast,
  });
};

export const storeParsedIncreaseLiquidityCsv = async () => {
  console.log(`storeParsedIncreaseLiquidityCsv started`);

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

  let counter = 0;

  const ilModel = await getModel(ModelType.increaseLiquidity);

  const parser = await getCommonParser(pathToFile, headers);
  for await (const record of parser) {
    try {
      await ilModel.create(record);
      counter++;
    } catch (err) {
      if (err instanceof Error) {
        // console.error(err.message);
      }
    }
  }

  console.log(`storeParsedIncreaseLiquidityCsv finished. Added: ${counter}`);
};
export const storeParsedDecreaseLiquidityCsv = async () => {
  console.log(`storeParsedDecreaseLiquidityCsv started`);

  const pathToFile = "input/bsc/decreaseLiquidityFunctionCall.csv";
  const headers = [
    "tx",
    "timestamp",
    "block",
    "output_amount0",
    "output_amount1",
    "params",
  ];

  let counter = 0;
  const dlModel = await getModel(ModelType.decreaseLiquidity);

  const parser = await getCommonParser(pathToFile, headers);
  for await (const record of parser) {
    try {
      await dlModel.create(record);
      counter++;
    } catch (err) {
      if (err instanceof Error) {
        // console.error(err.message);
      }
    }
  }
  console.log(`storeParsedDecreaseLiquidityCsv finished. Added: ${counter}`);
};
