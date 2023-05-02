import { ethers, utils } from "ethers";
import { getProvider } from "./provider";
import MasterChefV3 from "../blockchain/abi/MasterChefV3.json";
import { hexDataSlice } from "ethers/lib/utils";

const masterChefV3Contract = new ethers.Contract(
  "0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73",
  MasterChefV3,
  getProvider(56)
);
const iMasterChefV3 = new ethers.utils.Interface(MasterChefV3);

const iUpdateLiquidity = new ethers.utils.Interface([
  "updateLiquidity(uint256)",
]);

const startBlock = 26933904;

const lastSyncBlock = 27847089;

export const indexing = async () => {
  const provider = getProvider(56);

  const filter = {
    address: "0x556B9306565093C855AEA9AE92A594704c2Cd59e",
    fromBlock: startBlock,
    toBlock: startBlock + 1000,
  };
  // await provider.getLogs(filter).then(async (logs) => {
  //   console.log(`SIZE of logs: ${logs.length}`);
  //   for (let log of logs) {
  //     const parsed = iMasterChefV3.parseLog(log);
  //     console.log(log);
  //     console.log(parsed);
  //   }
  // });

  for (let i = startBlock; i < startBlock + 1000; i++) {
    provider.getBlockWithTransactions(i).then((result) => {
      result.transactions.forEach((tx, index) => {
        // console.log(`startBlock: ${i}. tx index: ${index}`);
        try {
          const parsedTx = iMasterChefV3.parseTransaction(tx);
          ethers.utils.defaultAbiCoder.decode(
            ["bytes", "string"],
            hexDataSlice(tx.data, 4)
          );
          console.log(parsedTx);
        } catch (ignore) {}
      });
    });
  }
};
