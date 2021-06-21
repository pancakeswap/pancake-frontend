import fs from "fs";
import path from "path";
import { TokenList } from "@uniswap/token-lists";
import { version } from "../package.json";
import pancakeswapDefault from "./tokens/pancakeswap-default.json";
import pancakeswapExtended from "./tokens/pancakeswap-extended.json";
import pancakeswapTop100 from "./tokens/pancakeswap-top-100.json";
import pancakeswapTop15 from "./tokens/pancakeswap-top-15.json";

const lists = {
  "pancakeswap-default": {
    list: pancakeswapDefault,
    name: "PancakeSwap Default",
    keywords: ["pancakeswap", "default"],
    logoURI:
      "https://assets.trustwalletapp.com/blockchains/smartchain/assets/0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82/logo.png",
    sort: false,
  },
  "pancakeswap-extended": {
    list: pancakeswapExtended,
    name: "PancakeSwap Extended",
    keywords: ["pancakeswap", "extended"],
    logoURI:
      "https://assets.trustwalletapp.com/blockchains/smartchain/assets/0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82/logo.png",
    sort: true,
  },
  "pancakeswap-top-100": {
    list: pancakeswapTop100,
    name: "PancakeSwap Top 100",
    keywords: ["pancakeswap", "top 100"],
    logoURI:
      "https://assets.trustwalletapp.com/blockchains/smartchain/assets/0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82/logo.png",
    sort: true,
  },
  "pancakeswap-top-15": {
    list: pancakeswapTop15,
    name: "PancakeSwap Top 15",
    keywords: ["pancakeswap", "top 15"],
    logoURI:
      "https://assets.trustwalletapp.com/blockchains/smartchain/assets/0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82/logo.png",
    sort: true,
  },
};

export const buildList = (listName: string): TokenList => {
  const [major, minor, patch] = version.split(".").map((versionNumber) => parseInt(versionNumber, 10));
  const { list, name, keywords, logoURI, sort } = lists[listName];
  return {
    name,
    timestamp: new Date().toISOString(),
    version: {
      major,
      minor,
      patch,
    },
    logoURI,
    keywords,
    // sort them by symbol for easy readability (not applied to default list)
    tokens: sort
      ? list.sort((t1, t2) => {
          if (t1.chainId === t2.chainId) {
            // CAKE first in extended list
            if ((t1.symbol === "CAKE") !== (t2.symbol === "CAKE")) {
              return t1.symbol === "CAKE" ? -1 : 1;
            }
            return t1.symbol.toLowerCase() < t2.symbol.toLowerCase() ? -1 : 1;
          }
          return t1.chainId < t2.chainId ? -1 : 1;
        })
      : list,
  };
};

export const saveList = (tokenList: TokenList, listName: string): void => {
  const tokenListPath = `${path.resolve()}/lists/${listName}.json`;
  const stringifiedList = JSON.stringify(tokenList, null, 2);
  fs.writeFileSync(tokenListPath, stringifiedList);
  console.info("Token list saved to ", tokenListPath);
};
