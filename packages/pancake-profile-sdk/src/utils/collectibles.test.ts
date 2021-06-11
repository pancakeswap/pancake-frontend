import { MAINNET_CHAIN_ID, IPFS_GATEWAY } from "../constants/common";
import web3NoAccount from "./web3";
import { getIdentifierKeyFromAddress, getTokenUrl, getTokenUriData, getNftByTokenId } from "./collectibles";
import nfts from "../constants/nfts";
import { server, rest } from "../mocks/server";

jest.mock("../constants/nfts");
jest.mock("./contractHelpers");

const PANCAKE_NFT_ADDRESS = "0xDf7952B35f24aCF7fC0487D01c8d5690a60DBa07";
const MIXIE_NFT_ADDRESS = "0xa251b5EAa9E67F2Bc8b33F33e20E91552Bf85566";
const UNKNOWN_NFT_ADDRESS = "0xa111122229E67F2Bc8b33F33e20E915522221111";
const MOCK_TOKEN_ID = 5;

describe("collectibles", () => {
  it("getIdentifierKeyFromAddress returns proper identifier key", () => {
    const pancakeIdentifierKey = getIdentifierKeyFromAddress(PANCAKE_NFT_ADDRESS, MAINNET_CHAIN_ID);
    const mixieIdentifierKey = getIdentifierKeyFromAddress(MIXIE_NFT_ADDRESS, MAINNET_CHAIN_ID);
    expect(pancakeIdentifierKey).toBe("image");
    expect(mixieIdentifierKey).toBe("otherIdentifier");
  });

  it("getIdentifierKeyFromAddress returns null for unknown nft", () => {
    const identifierKey = getIdentifierKeyFromAddress(UNKNOWN_NFT_ADDRESS, MAINNET_CHAIN_ID);
    expect(identifierKey).toBeNull();
  });

  it("getTokenUrl returns ipfs link if tokenUri is ipfs uri", () => {
    const originalUri = "ipfs://example/something.json";
    const tokenUri = getTokenUrl(originalUri);
    expect(tokenUri).toBe(`${IPFS_GATEWAY}/ipfs/${originalUri.slice(7)}`);
  });

  it("getTokenUrl returns https link if tokenUri is https uri", () => {
    const originalUri = "https://example.com/something.json";
    const tokenUri = getTokenUrl(originalUri);
    expect(tokenUri).toBe(originalUri);
  });

  it("getTokenUriData returns proper response", async () => {
    const uriData = await getTokenUriData(PANCAKE_NFT_ADDRESS, MOCK_TOKEN_ID, web3NoAccount);
    expect(uriData).toEqual({
      name: "Sleepy",
      description: "Aww, looks like eating pancakes all day is tough work. Sweet dreams!",
      image: "ipfs://QmYD9AtzyQPjSa9jfZcZq88gSaRssdhGmKqQifUDjGFfXm/sleepy.png",
      attributes: {
        bunnyId: "5",
      },
    });
  });

  it("getTokenUriData returns null if request failed", async () => {
    server.use(
      rest.get(
        `${IPFS_GATEWAY}/ipfs/QmYsTqbmGA3H5cgouCkh8tswJAQE1AsEko9uBZX9jZ3oTC/sleepy.json`,
        async (req, res, ctx) => {
          return res(ctx.status(500), ctx.json({ message: "500 Internal Server Error" }));
        }
      )
    );
    const uriData = await getTokenUriData(PANCAKE_NFT_ADDRESS, MOCK_TOKEN_ID, web3NoAccount);
    expect(uriData).toBeNull();
  });

  it("getNftByTokenId returns proper nft", async () => {
    const sleepyNft = nfts.find((nft) => nft.identifier === "sleepy");
    const nft = await getNftByTokenId(PANCAKE_NFT_ADDRESS, MOCK_TOKEN_ID, web3NoAccount, MAINNET_CHAIN_ID);
    expect(nft).toBe(sleepyNft);
  });

  it("getNftByTokenId returns null if uriData is null", async () => {
    server.use(
      rest.get(
        `${IPFS_GATEWAY}/ipfs/QmYsTqbmGA3H5cgouCkh8tswJAQE1AsEko9uBZX9jZ3oTC/sleepy.json`,
        async (req, res, ctx) => {
          return res(ctx.status(500), ctx.json({ message: "500 Internal Server Error" }));
        }
      )
    );
    const nft = await getNftByTokenId(PANCAKE_NFT_ADDRESS, MOCK_TOKEN_ID, web3NoAccount, MAINNET_CHAIN_ID);
    expect(nft).toBe(null);
  });

  it("getNftByTokenId returns null if identifierKey is null", async () => {
    const nft = await getNftByTokenId(UNKNOWN_NFT_ADDRESS, MOCK_TOKEN_ID, web3NoAccount, MAINNET_CHAIN_ID);
    expect(nft).toBe(null);
  });

  it("getNftByTokenId returns null if uriData does not contain indentifierKey", async () => {
    // In the NFT constant mocks MIXIE NFT type is intentionally given wrong identifier
    const nft = await getNftByTokenId(MIXIE_NFT_ADDRESS, MOCK_TOKEN_ID, web3NoAccount, MAINNET_CHAIN_ID);
    expect(nft).toBe(null);
  });
});
