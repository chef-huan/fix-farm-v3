import { BaseProvider, StaticJsonRpcProvider } from "@ethersproject/providers";
import { ethers } from "ethers";

export const bscProvider = new StaticJsonRpcProvider(
  {
    url: "https://nodes.pancakeswap.info",
    skipFetchSetup: true,
  },
  56
);

export const bscTestnetProvider = new StaticJsonRpcProvider(
  {
    url: "https://bsc-testnet.nodereal.io/v1/e9a36765eb8a40b9bd12e680a1fd2bc5",
    skipFetchSetup: true,
  },
  97
);

export const goerliProvider = new StaticJsonRpcProvider(
  {
    url: "https://eth-goerli.nodereal.io/v1/8a4432e42df94dcca2814fde8aea2a2e",
    skipFetchSetup: true,
  },
  5
);

export const ethMainnetProvider = new StaticJsonRpcProvider(
  {
    url: `https://eth-mainnet.nodereal.io/v1/${process.env.ETH_MAINNET_NODEREAL_KEY}`,
    skipFetchSetup: true,
  },
  1
);

export const getProvider = (networkId: number): BaseProvider => {
  switch (networkId) {
    case 56:
      return bscProvider;
    case 97:
      return bscTestnetProvider;
    case 5:
      return goerliProvider;
    case 1:
      return ethMainnetProvider;
    default:
      return ethers.getDefaultProvider(ethers.providers.getNetwork(networkId));
  }
};
