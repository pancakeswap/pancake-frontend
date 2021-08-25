import fs from "fs";
import path from "path";
import { request, gql } from "graphql-request";
import { getAddress } from "@ethersproject/address";
import slugify from "slugify";

const pathToImages = process.env.CI
  ? path.join(process.env.GITHUB_WORKSPACE, "packages", "token-lists", "lists", "images")
  : path.join(path.resolve(), "lists", "images");
const logoFiles = fs.readdirSync(pathToImages);

// Interface for Bitquery GraphQL response.
interface BitqueryEntity {
  // eslint-disable-next-line camelcase
  Total_USD: number;
  baseCurrency: {
    address: string;
    name: string;
    symbol: string;
    decimals: number;
  };
}

// Default token list for exchange + manual exclusion of broken BEP-20 token(s)
const blacklist: string[] = [
  // List of default tokens to exclude
  "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c", // WBNB
  "0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82", // CAKE
  "0xe9e7cea3dedca5984780bafc599bd69add087d56", // BUSD
  "0x55d398326f99059fF775485246999027B3197955", // USDT
  "0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c", // BTCB
  "0x2170ed0880ac9a755fd29b2688956bd959f933f8", // ETH
  "0xc9849e6fdb743d08faee3e34dd2d1bc69ea11a51", // BUNNY
  "0xcf6bb5389c92bdda8a3747ddb454cb7a64626c63", // XVS
  "0x8076c74c5e3f5852037f31ff0093eeb8c8add8d3", // SAFEMOON
  "0x8f0528ce5ef7b51152a59745befdd91d97091d2f", // ALPACA
  "0x7083609fce4d1d8dc0c979aab8c869ea2c873402", // DOT
  "0x4e6415a5727ea08aae4580057187923aec331227", // FINE
  "0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3", // DAI
  "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d", // USDC
  "0x844fa82f1e54824655470970f7004dd90546bb28", // DOP

  // List of broken tokens
  "0x4269e4090ff9dfc99d8846eb0d42e67f01c3ac8b",
  "0xe2e7329499e8ddb1f2b04ee4b35a8d7f6881e4ea",
];

/**
 * Return today / 1 month ago ISO-8601 DateTime.
 *
 * @returns string[]
 */
const getDateRange = (): string[] => {
  const today = new Date();
  const todayISO = today.toISOString();
  today.setMonth(today.getMonth() - 1);
  const monthAgoISO = today.toISOString();

  return [todayISO, monthAgoISO];
};

/**
 * Fetch Top100 Tokens traded on PancakeSwap v2, ordered by trading volume,
 * for the past 30 days, filtered to remove default / broken tokens.
 *
 * @returns BitqueryEntity[]]
 */
const getTokens = async (): Promise<BitqueryEntity[]> => {
  try {
    const [today, monthAgo] = getDateRange();

    const { ethereum } = await request(
      "https://graphql.bitquery.io/",
      gql`
        query ($from: ISO8601DateTime, $till: ISO8601DateTime, $blacklist: [String!]) {
          ethereum(network: bsc) {
            dexTrades(
              options: { desc: "Total_USD", limit: 100 }
              exchangeName: { is: "Pancake v2" }
              baseCurrency: { notIn: $blacklist }
              date: { since: $from, till: $till }
            ) {
              Total_USD: tradeAmount(calculate: sum, in: USD)
              baseCurrency {
                address
                name
                symbol
                decimals
              }
            }
          }
        }
      `,
      {
        from: monthAgo,
        till: today,
        blacklist,
      }
    );

    return ethereum.dexTrades;
  } catch (error) {
    return error;
  }
};

/**
 * Returns the URI of a token logo
 * Note: If present in extended list, use main logo, else fallback to TrustWallet
 *
 * @returns string
 */
const getTokenLogo = (address: string): string => {
  // Note: fs.existsSync can't be used here because its not case sensetive
  if (logoFiles.includes(`${address}.png`)) {
    return `https://tokens.pancakeswap.finance/images/${address}.png`;
  }

  return `https://assets.trustwalletapp.com/blockchains/smartchain/assets/${address}/logo.png`;
};

/**
 * Main function.
 * Fetch tokems, build list, save list.
 */
const main = async (): Promise<void> => {
  try {
    const tokens = await getTokens();

    const sanitizedTokens = tokens.reduce((list, item: BitqueryEntity) => {
      const checksummedAddress = getAddress(item.baseCurrency.address);

      const updatedToken = {
        name: slugify(item.baseCurrency.name, {
          replacement: " ",
          remove: /[^\w\s.]/g,
        }),
        symbol: slugify(item.baseCurrency.symbol, {
          replacement: "-",
          remove: /[^\w\s.]/g,
        }).toUpperCase(),
        address: checksummedAddress,
        chainId: 56,
        decimals: item.baseCurrency.decimals,
        logoURI: getTokenLogo(checksummedAddress),
      };
      return [...list, updatedToken];
    }, []);

    const tokenListPath = `${path.resolve()}/src/tokens/pancakeswap-top-100.json`;
    console.info("Saving updated list to ", tokenListPath);
    const stringifiedList = JSON.stringify(sanitizedTokens, null, 2);
    fs.writeFileSync(tokenListPath, stringifiedList);
  } catch (error) {
    console.error(`Error when fetching Top100 Tokens by volume for the past 30 days, error: ${error.message}`);
  }
};

export default main;
