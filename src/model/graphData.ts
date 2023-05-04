export interface User {
  id: string;
}

export interface Deposit {
  id: string;
  user: User;

  rewardGrowthInside: string;

  pid: string;
  tokenId: string;
  tickLower: string;
  tickUpper: string;
  liquidity: string;
  boostLiquidity: string;
  lmPool: string;
  timestamp: number;
  block: number;
}
