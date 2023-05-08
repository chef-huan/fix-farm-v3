import { storeParsedCsv } from "./service/csv/parseCsv";
import { ModelType } from "./db/mongodb/mongo";
import { fixDeposits } from "./service/fixDeposit";

const init = async () => {
  console.log("Init");
  await Promise.all([
    // storeParsedCsv(ModelType.updateLiquidity),
    // storeParsedCsv(ModelType.increaseLiquidity),
    // storeParsedCsv(ModelType.decreaseLiquidity),
    // storeParsedCsv(ModelType.withdraw),
    // storeParsedCsv(ModelType.harvest),
  ]);
};

init().then(async () => {
  console.log("Init finished");

  await fixDeposits(56);
});
