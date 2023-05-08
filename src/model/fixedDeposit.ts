import { ModelType } from "../db/mongodb/mongo";

export type MethodCall = {
  type: ModelType;
  block: number;
};
