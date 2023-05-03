import path from "path";
import * as fs from "fs";
import { CastingFunction, parse, Parser } from "csv-parse";
import { getModel, ModelType } from "../../db/mongodb/mongo";
import { configMap } from "./configCsv";
import { getUserFromUserPositionInfo } from "../blockScan";

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

  const data = configMap.get(type);
  if (!data) {
    throw Error(`Undefined type ${type}`);
  }

  let counter = 0;
  const model = await getModel(type);

  const parser = await getCommonParser(data.pathToFile, data.headers, cast);
  for await (const record of parser) {
    try {
      let user;
      if (
        type === ModelType.harvest ||
        type === ModelType.withdraw ||
        type === ModelType.updateLiquidity
      ) {
        user = await getUserFromUserPositionInfo(record.tokenId, record.block);
      } else {
        const tokenId = JSON.parse(record.params).tokenId;
        user = await getUserFromUserPositionInfo(tokenId, record.block);
      }
      if (user) {
        await model.create(Object.assign({ user }, record));
        counter++;
      } else {
        console.log(`Cannot save ${type} ${record.tx}`);
      }
    } catch (err) {
      if (err instanceof Error) {
        console.error(err.message);
      }
    }
  }

  console.log(`storeParsedCsv finished. type: ${type}. added rows: ${counter}`);
};
