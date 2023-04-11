import { getAddress } from "@ethersproject/address";
import memoize from "lodash/memoize";
import { ChainId, Token } from "@pancakeswap/sdk";

const mapping: { [key: number]: string } = {
  [ChainId.BSC]: "smartchain",
  [ChainId.ETHEREUM]: "ethereum",
};

export const getTokenLogoURL = memoize(
  (token?: Token) => {
    if (token && mapping[token.chainId]) {
      return `/images${token.chainId === ChainId.BSC ? "" : `/${token.chainId}`}/tokens/${getAddress(
        token.address
      )}.png`;
    }
    return null;
  },
  (t) => `${t?.chainId}#${t?.address}`
);

export const getTokenLogoURLByAddress = memoize(
  (address?: string, chainId?: number) => {
    if (address && chainId && mapping[chainId]) {
      return `/images${chainId === ChainId.BSC ? "" : `/${chainId}`}/tokens/${getAddress(address)}.png`;
    }
    return null;
  },
  (address, chainId) => `${chainId}#${address}`
);
