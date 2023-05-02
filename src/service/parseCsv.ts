import path from "path";
import * as fs from "fs";
import { parse, CastingFunction, Parser } from "csv-parse";
import { getModel, ModelType } from "../db/mongodb/mongo";

const map = new Map<string, { pathToFile: string; headers: string[] }>();
map.set(ModelType.updateLiquidity, {
  pathToFile: "input/bsc/updateLiquidityFunctionCall.csv",
  headers: ["tx", "timestamp", "block", "tokenId"],
});

map.set(ModelType.increaseLiquidity, {
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

map.set(ModelType.decreaseLiquidity, {
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

export const storeParsedCsv = async (
  type: ModelType,
  cast?: CastingFunction
) => {
  console.log(`storeParsedCsv started. type: ${type}`);

  const data = map.get(type);
  if (!data) {
    throw Error(`Undefined type ${type}`);
  }

  let counter = 0;
  const model = await getModel(type);

  const parser = await getCommonParser(data.pathToFile, data.headers, cast);
  for await (const record of parser) {
    try {
      await model.create(record);
      counter++;
    } catch (err) {
      if (err instanceof Error) {
        // console.error(err.message);
      }
    }
  }

  console.log(`storeParsedCsv finished. type: ${type}. added rows: ${counter}`);
};
