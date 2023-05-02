import { storeParsedIncreaseLiquidityCsv } from "./service/parseCsv";

const init = async () => {
  await storeParsedIncreaseLiquidityCsv();
};

init().then(() => {
  console.log("done");
});
