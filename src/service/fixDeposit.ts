import { getModel, ModelType } from "../db/mongodb/mongo";
import { getAffectedDepositsNextPages } from "./subgraph";
import { MethodCall } from "../model/fixedDeposit";
import { updateInfectedDeposit } from "./blockScan";

const getMethodsCall = async (
  user: string,
  block: number
): Promise<MethodCall[]> => {
  const updateLiquidityModel = await getModel(ModelType.updateLiquidity);
  const increaseLiquidityModel = await getModel(ModelType.increaseLiquidity);
  const decreaseLiquidityModel = await getModel(ModelType.decreaseLiquidity);
  const withdrawModel = await getModel(ModelType.withdraw);
  const harvestModel = await getModel(ModelType.harvest);

  const updateLiquidityCalls = (
    await updateLiquidityModel.find({ user, block: { $gt: block } }).lean()
  ).map((el) => ({ type: ModelType.updateLiquidity, block: Number(el.block) }));

  const increaseLiquidityCalls = (
    await increaseLiquidityModel.find({ user, block: { $gt: block } }).lean()
  ).map((el) => ({ type: ModelType.increaseLiquidity, block: el.block }));

  const decreaseLiquidityCalls = (
    await decreaseLiquidityModel.find({ user, block: { $gt: block } }).lean()
  ).map((el) => ({ type: ModelType.decreaseLiquidity, block: el.block }));
  const withdrawCalls = (
    await withdrawModel.find({ user, block: { $gt: block } }).lean()
  ).map((el) => ({ type: ModelType.withdraw, block: el.block }));
  const harvestCalls = (
    await harvestModel.find({ user, block: { $gt: block } }).lean()
  ).map((el) => ({ type: ModelType.harvest, block: el.block }));

  return [
    ...updateLiquidityCalls,
    ...increaseLiquidityCalls,
    ...decreaseLiquidityCalls,
    ...withdrawCalls,
    ...harvestCalls,
  ].sort((a, b) => a.block - b.block);
};

export const fixDeposits = async (networkId: number) => {
  console.log("Start fixDeposits");
  let affectedDeposits = await getAffectedDepositsNextPages(networkId);

  let allFetched = false;
  while (!allFetched) {
    for (const affectedDeposit of affectedDeposits) {
      const methodsCalls: MethodCall[] = await getMethodsCall(
        affectedDeposit.user.id,
        affectedDeposit.block
      );
      await updateInfectedDeposit(affectedDeposit, methodsCalls, networkId);
    }
    if (affectedDeposits.length < 1000) {
      allFetched = true;
    } else {
      affectedDeposits = await getAffectedDepositsNextPages(
        networkId,
        affectedDeposits[affectedDeposits.length - 1].timestamp
      );
    }
  }

  console.log("Finished fixDeposits");
};
