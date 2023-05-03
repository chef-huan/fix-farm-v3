import { storeParsedCsv } from "./service/csv/parseCsv";
import { ModelType } from "./db/mongodb/mongo";

const init = async () => {
  console.log("Init");
  await Promise.all([
    storeParsedCsv(ModelType.updateLiquidity),
    storeParsedCsv(ModelType.increaseLiquidity),
    storeParsedCsv(ModelType.decreaseLiquidity),
    storeParsedCsv(ModelType.withdraw),
    storeParsedCsv(ModelType.harvest),
  ]);
};

init().then(() => {
  console.log("Init finished");
});
