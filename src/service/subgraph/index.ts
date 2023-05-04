import request, { gql } from "graphql-request";
import { Deposit } from "../../model/graphData";

export const getAffectedDepositsNextPages = async (
  networkId: number,
  lastTimeStamp?: number
): Promise<Deposit[]> => {
  const lastTimeStampQuery =
    (lastTimeStamp && " timestamp_gte:  $lastTimeStamp ") || "";

  let graphUrl =
    "https://api.thegraph.com/subgraphs/name/chef-huan/farm-issue-v3-eth";
  switch (networkId) {
    case 1:
      graphUrl =
        "https://api.thegraph.com/subgraphs/name/chef-huan/farm-issue-v3-eth";
      break;
    case 56:
      graphUrl =
        "https://api.thegraph.com/subgraphs/name/chef-huan/farm-issue-v3-bsc";
      break;
  }

  const { deposits } = await request(
    graphUrl,
    gql`
            query getSwapsQuery($lastTimeStamp: Int) {
                deposits(
                    first: 1000
                    orderBy: timestamp
                    orderDirection: asc
                    where: ${"{" + lastTimeStampQuery + "}"}
                ) {
                    id
                    user {id}
                    rewardGrowthInside
                    pid
                    tokenId
                    tickLower
                    tickUpper
                    liquidity
                    boostLiquidity
                    lmPool
                    timestamp
                    block
                }
            }
        `,
    { lastTimeStamp }
  );

  return deposits;
};
