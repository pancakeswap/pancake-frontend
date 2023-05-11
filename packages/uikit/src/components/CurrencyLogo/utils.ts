import { getAddress } from "viem";
import memoize from "lodash/memoize";
import { ChainId, Token, Currency } from "@pancakeswap/sdk";

const mapping: { [key: number]: string } = {
  [ChainId.BSC]: "smartchain",
  [ChainId.ETHEREUM]: "ethereum",
};

export const getTokenLogoURL = memoize(
  (token?: Token) => {
    if (token && mapping[token.chainId]) {
      return `https://assets-cdn.trustwallet.com/blockchains/${mapping[token.chainId]}/assets/${getAddress(
        token.address
      )}/logo.png`;
    }
    return null;
  },
  (t) => `${t?.chainId}#${t?.address}`
);

export const getTokenLogoURLByAddress = memoize(
  (address?: string, chainId?: number) => {
    if (address && chainId && mapping[chainId]) {
      return `https://assets-cdn.trustwallet.com/blockchains/${mapping[chainId]}/assets/${getAddress(
        address
      )}/logo.png`;
    }
    return null;
  },
  (address, chainId) => `${chainId}#${address}`
);

const chainName: { [key: number]: string } = {
  [ChainId.BSC]: "",
  [ChainId.ETHEREUM]: "eth",
};

export const getCurrencyLogoUrls = memoize(
  (currency?: Currency): string[] => {
    const chainId = currency?.chainId || ChainId.BSC;
    const tokenAddress = getAddress(currency?.wrapped?.address || "");
    const trustWalletLogo = getTokenLogoURL(currency?.wrapped);
    const logoUrl = `https://tokens.pancakeswap.finance/images/${
      chainId === ChainId.BSC ? "" : `${chainName[chainId]}/`
    }${tokenAddress}.png`;
    return [trustWalletLogo, logoUrl].filter((url) => Boolean(url)) as string[];
  },
  (currency?: Currency) => `logoUrls#${currency?.chainId}#${currency?.wrapped?.address}`
);
