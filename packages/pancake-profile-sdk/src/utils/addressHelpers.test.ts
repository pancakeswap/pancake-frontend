import addresses from "../constants/contracts";
import { MAINNET_CHAIN_ID, TESTNET_CHAIN_ID } from "../constants/common";
import { getPancakeProfileAddress } from "./addressHelpers";

describe("addressHelpers", () => {
  it("getAddress returns correct mainnet address", () => {
    const profileAddress = getPancakeProfileAddress(MAINNET_CHAIN_ID);
    expect(profileAddress).toBe(addresses.pancakeProfile[MAINNET_CHAIN_ID]);
  });
  it("getAddress returns correct testnet address", () => {
    const profileAddress = getPancakeProfileAddress(TESTNET_CHAIN_ID);
    expect(profileAddress).toBe(addresses.pancakeProfile[TESTNET_CHAIN_ID]);
  });
});
