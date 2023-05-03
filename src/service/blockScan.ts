import { ethers, utils } from "ethers";
import { getProvider } from "./provider";
import MasterChefV3 from "../blockchain/abi/MasterChefV3.json";
import { hexDataSlice } from "ethers/lib/utils";

const masterChefV3Contract = new ethers.Contract(
  "0x556B9306565093C855AEA9AE92A594704c2Cd59e",
  MasterChefV3,
  getProvider(56)
);

export const getUserFromUserPositionInfo = async (
  tokenId: string,
  blockTag: number
): Promise<string> => {
  const blockNumber = Number(blockTag);
  let result;
  try {
    result = await masterChefV3Contract.functions.userPositionInfos(tokenId, {
      blockTag: blockNumber,
    });
  } catch (err) {
    if (err instanceof Error) {
      console.error(tokenId, blockTag, err.message);
    } else {
      console.error(tokenId, blockTag);
    }
  }

  return result?.user?.toLowerCase();
};

const iMasterChefV3 = new ethers.utils.Interface(MasterChefV3);

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
