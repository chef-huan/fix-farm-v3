import { ethers, BigNumber } from "ethers";
import { getProvider } from "./provider";
import MasterChefV3 from "../blockchain/abi/MasterChefV3.json";
import PancakeV3LmPool from "../blockchain/abi/PancakeV3LmPool.json";
import { Deposit } from "../model/graphData";

const uint256MaxDiv2 = BigNumber.from(
  "57896044618658097711785492504343953926634992332820282019728792003956564819967"
);
const uint256Max = uint256MaxDiv2.mul(2);

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

const updateInfectedDeposit = async (
  deposit: Deposit,
  functionCallBlockNumber: number
) => {
  // 2.Use call to check the new reward growth number from lmPool
  const lmPoolContract = new ethers.Contract(
    deposit.lmPool,
    PancakeV3LmPool,
    getProvider(56)
  );
  const rewardGrowthInside =
    await lmPoolContract.functions.getRewardGrowthInside(
      deposit.tickLower,
      deposit.tickUpper,
      {
        blockTag: functionCallBlockNumber,
      }
    );

  const rewardGrowthInsideX128 = BigNumber.from(
    rewardGrowthInside.rewardGrowthInsideX128
  );

  //3. Check if `rewardGrowthInside` is still larger than `uint256Max / 2`
  if (rewardGrowthInsideX128.gt(uint256MaxDiv2)) {
  } else {
    //If false, we need to perform manual accounting and reward calculation
    //a. Calculate the offset between the previous rewardGrowthInside and uint256Max
    const rewardPartOne = uint256Max
      .sub(BigNumber.from(deposit.rewardGrowthInside))
      .add(1);
    const rewardPartTwo = rewardGrowthInsideX128;
    // const rewardTotal = rewardPartOne
    //   .add(rewardPartTwo)
    //   .mul(deposit.boostLiquidity)
    //   .div(Q128);
  }
};
