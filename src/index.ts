import { parseCsv } from "./service/parseCsv";

const init = async () => {
  parseCsv("input/bsc/increaseLiquidityFunctionCall.csv");
};

init().then(() => {});
