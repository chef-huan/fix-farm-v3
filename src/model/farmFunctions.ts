export interface HarvestFunction {
  tx: string;
  timestamp: number;
  block: number;
  to: string;
  tokenId: string;
  output_reward: string;
}

export interface WithdrawFunction {
  tx: string;
  timestamp: number;
  block: number;
  to: string;
  tokenId: string;
  output_reward: string;
}

export interface DecreaseLiquidityFunction {
  tx: string;
  timestamp: number;
  block: number;
  output_amount0: string;
  output_amount1: string;

  //{"tokenId":65217,"liquidity":1026173323333157676860999,"amount0Min":0,"amount1Min":92187981572299871126,"deadline":1683004843}
  params: string;
}

export interface IncreaseLiquidityFunction {
  tx: string;
  timestamp: number;
  block: number;
  output_amount0: string;
  output_amount1: string;
  output_liquidity: string;

  //{"tokenId":65774,"amount0Desired":325160404904119455,"amount1Desired":838596085503195990205,"amount0Min":0,"amount1Min":0,"deadline":1683008619}
  params: string;
}

export interface UpdateLiquidityFunction {
  tx: string;
  timestamp: number;
  block: number;
  _tokenId: string;
}
