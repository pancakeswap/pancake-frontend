import Web3 from "web3";
import web3NoAccount from "./web3";

describe("web3", () => {
  it("returns an instance of Web3", () => {
    expect(web3NoAccount).toBeInstanceOf(Web3);
  });
});
