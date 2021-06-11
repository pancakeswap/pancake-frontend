import Web3 from "web3";
import { MAINNET_CHAIN_ID } from "../constants/common";
import web3NoAccount from "./web3";
import { getProfileContract, getErc721Contract } from "./contractHelpers";

describe("contractHelpers", () => {
  it("getProfileContract returns an instance of Contract", () => {
    const profileContract = getProfileContract(web3NoAccount, MAINNET_CHAIN_ID);
    // toBeInstanceOf doesn't work very well with third-party libs, read more - https://stackoverflow.com/a/58032069/4614082
    expect(profileContract.constructor.name).toBe("Contract");
  });
  it("getErc721Contract returns an instance of Contract", () => {
    const erc721Contract = getErc721Contract("0x7777777777777777777777777777777777777777", web3NoAccount);
    expect(erc721Contract.constructor.name).toBe("Contract");
  });
  it("uses provided Web3 instnace", () => {
    const httpProvider = new Web3.providers.HttpProvider("https://example.com", {
      timeout: 10000,
    });
    const customWeb3 = new Web3(httpProvider);
    const pancakeRabbitContract = getProfileContract(customWeb3, MAINNET_CHAIN_ID);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(pancakeRabbitContract.currentProvider).toBe(httpProvider);
  });
});
