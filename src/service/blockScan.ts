import { BigNumber, ethers } from "ethers";
import { getProvider } from "./provider";
import MasterChefV3 from "../blockchain/abi/MasterChefV3.json";
import PancakeV3LmPool from "../blockchain/abi/PancakeV3LmPool.json";
import { Deposit } from "../model/graphData";
import { MethodCall } from "../model/fixedDeposit";
import { getModel, ModelType } from "../db/mongodb/mongo";

const uint256MaxDiv2 = BigNumber.from(
  "57896044618658097711785492504343953926634992332820282019728792003956564819967"
);

const Q128 = BigNumber.from("0x100000000000000000000000000000000");

const uint256Max = uint256MaxDiv2.mul(2);

const getMasterChefV3Contract = (networkId: number) =>
  new ethers.Contract(
    "0x556B9306565093C855AEA9AE92A594704c2Cd59e",
    MasterChefV3,
    getProvider(networkId)
  );

export const getUserFromUserPositionInfo = async (
  tokenId: string,
  blockTag: number,
  networkId: number
): Promise<string> => {
  const blockNumber = Number(blockTag);
  let result;
  try {
    result = await getMasterChefV3Contract(
      networkId
    ).functions.userPositionInfos(tokenId, {
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

export const updateInfectedDeposit = async (
  deposit: Deposit,
  methodsCalls: MethodCall[],
  networkId: number
) => {
  const affectedDepositModel = await getModel(ModelType.affectedDeposit);

  if (await affectedDepositModel.exists({ externalId: deposit.id })) {
    console.log(`deposit.id already exist`);
    return;
  }

  let prevRewardGrowthInside = deposit.rewardGrowthInside;
  const { id, ...depositToStore } = deposit;

  for (const [index, methodCall] of methodsCalls.entries()) {
    const functionCallBlockNumber = methodCall.block;
    // 2.Use call to check the new reward growth number from lmPool
    const lmPoolContract = new ethers.Contract(
      deposit.lmPool,
      PancakeV3LmPool,
      getProvider(networkId)
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
      //5. If true (still larger), we need to update the stored reward growth as the accounting is successful
      prevRewardGrowthInside = rewardGrowthInsideX128.toString();
    } else {
      //4. If false, we need to perform manual accounting and reward calculation
      //a. Calculate the offset between the previous rewardGrowthInside and uint256Max
      const rewardPartOne = uint256Max
        .sub(BigNumber.from(prevRewardGrowthInside))
        .add(1);
      const rewardPartTwo = rewardGrowthInsideX128;
      const rewardTotal = rewardPartOne
        .add(rewardPartTwo)
        .mul(deposit.boostLiquidity)
        .div(Q128);
      //Mark deposit as fixed
      console.log("Fixed", deposit.id, rewardTotal.toString());

      await affectedDepositModel.create({
        networkId,
        externalId: deposit.id,
        fixed: true,
        rewardTotal: rewardTotal.toString(),
        rewardGrowthInside: prevRewardGrowthInside,
        originalDeposit: JSON.stringify(depositToStore),
        methodsCalled: JSON.stringify(methodsCalls),
        methodsCalledCount: methodsCalls.length,
        fixMethodCallIndex: index,
        lastMethodCheckedBlock: methodCall.block,
        timestamp: deposit.timestamp,
      });

      return;
    }
  }

  await affectedDepositModel.create({
    networkId,
    externalId: deposit.id,
    fixed: false,
    rewardTotal: "-1",
    rewardGrowthInside: prevRewardGrowthInside,
    originalDeposit: JSON.stringify(depositToStore),
    methodsCalled: JSON.stringify(methodsCalls),
    methodsCalledCount: methodsCalls.length,
    fixMethodCallIndex: -1,
    lastMethodCheckedBlock:
      methodsCalls[methodsCalls.length - 1]?.block || deposit.block,
    timestamp: deposit.timestamp,
  });

  console.log("Not Fixed", deposit.id);
};
