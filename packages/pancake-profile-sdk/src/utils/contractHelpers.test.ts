import { ethers } from "ethers";
import { MAINNET_CHAIN_ID } from "../constants/common";
import { getProfileContract, getErc721Contract } from "./contractHelpers";
import simpleRpcProvider from "./providers";

describe("contractHelpers", () => {
  it("getProfileContract returns an instance of Contract", () => {
    const profileContract = getProfileContract(simpleRpcProvider, MAINNET_CHAIN_ID);
    // toBeInstanceOf doesn't work very well with third-party libs, read more - https://stackoverflow.com/a/58032069/4614082
    expect(profileContract.constructor.name).toBe("Contract");
  });
  it("getErc721Contract returns an instance of Contract", () => {
    const erc721Contract = getErc721Contract("0x7777777777777777777777777777777777777777", simpleRpcProvider);
    expect(erc721Contract.constructor.name).toBe("Contract");
  });
  it("uses specified Provider instnace", () => {
    const customProvider = new ethers.providers.JsonRpcProvider("https://example.com");
    const pancakeRabbitContract = getProfileContract(customProvider, MAINNET_CHAIN_ID);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(pancakeRabbitContract.provider).toBe(customProvider);
  });
});
