import {
  storeParsedDecreaseLiquidityCsv,
  storeParsedIncreaseLiquidityCsv,
} from "./service/parseCsv";

const init = async () => {
  await Promise.all([
    storeParsedIncreaseLiquidityCsv(),
    storeParsedDecreaseLiquidityCsv(),
  ]);
};

init().then(() => {
  console.log("done");
});
