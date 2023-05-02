import { Document } from "mongoose";

export interface IncreaseLiquidity extends Document {
  tx: string;
  block: number;
  timestamp: number;
  tokenId: string;
  output_amount0: string;
  output_amount1: string;
  output_liquidity: string;
  params: string;
  created_at: Date;
}
