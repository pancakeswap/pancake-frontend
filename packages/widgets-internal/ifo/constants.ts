import { ChainId } from "@pancakeswap/chains";

// TODO: Consider moving to IFO package
export const ChainNameMap = {
  [ChainId.BSC]: "BSC",
  [ChainId.ETHEREUM]: "ETH",
  [ChainId.ARBITRUM_ONE]: "Arbitrum",
  [ChainId.ZKSYNC]: "ZKSync",
};

export type IfoChainId = keyof typeof ChainNameMap;
