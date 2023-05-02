import { storeParsedCsv } from "./service/parseCsv";
import { ModelType } from "./db/mongodb/mongo";

const init = async () => {
  console.log("Init");
  await Promise.all([
    storeParsedCsv(ModelType.updateLiquidity),
    storeParsedCsv(ModelType.increaseLiquidity),
    storeParsedCsv(ModelType.decreaseLiquidity),
  ]);
};

init().then(() => {
  console.log("Init finished");
});
