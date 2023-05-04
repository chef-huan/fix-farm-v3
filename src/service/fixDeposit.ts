import { getModel, ModelType } from "../db/mongodb/mongo";
import { getAffectedDepositsNextPages } from "./subgraph";

type MethodCall = {
  type: ModelType;
  block: number;
};

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

export const fixDeposits = async () => {
  let affectedDeposits = await getAffectedDepositsNextPages(56);

  let counterWithMethods = 0;
  let counterNoMethods = 0;

  let allFetched = false;
  while (!allFetched) {
    for (const affectedDeposit of affectedDeposits) {
      const methodsCall: MethodCall[] = await getMethodsCall(
        affectedDeposit.user.id,
        affectedDeposit.block
      );
      if (methodsCall.length === 0) {
        counterNoMethods++;
      } else {
        counterWithMethods++;
        if (methodsCall.length > 1) {
          console.log(
            `${affectedDeposit.id}, methodsCall.length ${methodsCall.length}`
          );
        }
      }
    }
    if (affectedDeposits.length < 1000) {
      allFetched = true;
    } else {
      affectedDeposits = await getAffectedDepositsNextPages(
        56,
        affectedDeposits[affectedDeposits.length - 1].timestamp
      );
    }
  }

  console.log(
    `Fix finished. counterWithMethods ${counterWithMethods}. counterNoMethods: ${counterNoMethods}`
  );
};
