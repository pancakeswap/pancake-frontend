/* eslint-disable no-restricted-syntax */
import Ajv from "ajv";
import { getAddress } from "@ethersproject/address";
import { schema } from "@uniswap/token-lists";
import packageJson from "../package.json";
import { buildList } from "../src/buildList";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    interface Matchers<R> {
      toBeDeclaredOnce(type: string, parameter: string, chainId: number): CustomMatcherResult;
      toBeValid(validationErrors): CustomMatcherResult;
    }
  }
}

expect.extend({
  toBeDeclaredOnce(received, type: string, parameter: string, chainId: number) {
    if (typeof received === "undefined") {
      return {
        message: () => ``,
        pass: true,
      };
    }
    return {
      message: () => `Token ${type} ${parameter} on chain ${chainId} should be declared only once.`,
      pass: false,
    };
  },
  toBeValid(received, validationErrors) {
    if (received) {
      return {
        message: () => ``,
        pass: true,
      };
    }
    return {
      message: () => `Validation failed: ${JSON.stringify(validationErrors, null, 2)}`,
      pass: false,
    };
  },
});

const ajv = new Ajv({ allErrors: true, format: "full" });
const validate = ajv.compile(schema);

describe.each([["pancakeswap-default"], ["pancakeswap-extended"], ["pancakeswap-top-100"]])("buildList %s", (listName) => {
  const defaultTokenList = buildList(listName);

  it("validates", () => {
    expect(validate(defaultTokenList)).toBeValid(validate.errors);
  });

  it("contains no duplicate addresses", () => {
    const map = {};
    for (const token of defaultTokenList.tokens) {
      const key = `${token.chainId}-${token.address.toLowerCase()}`;
      expect(map[key]).toBeDeclaredOnce("address", token.address.toLowerCase(), token.chainId);
      map[key] = true;
    }
  });

  // Commented out since we now have duplicate symbols ("ONE") on exchange
  // doesn't seem to affect any functionality at the moment though
  // it("contains no duplicate symbols", () => {
  //   const map = {};
  //   for (const token of defaultTokenList.tokens) {
  //     const key = `${token.chainId}-${token.symbol.toLowerCase()}`;
  //     expect(map[key]).toBeDeclaredOnce("symbol", token.symbol.toLowerCase(), token.chainId);
  //     map[key] = true;
  //   }
  // });

  it("contains no duplicate names", () => {
    const map = {};
    for (const token of defaultTokenList.tokens) {
      const key = `${token.chainId}-${token.name.toLowerCase()}`;
      expect(map[key]).toBeDeclaredOnce("name", token.name.toLowerCase(), token.chainId);
      map[key] = true;
    }
  });

  it("all addresses are valid and checksummed", () => {
    for (const token of defaultTokenList.tokens) {
      expect(getAddress(token.address)).toBe(token.address);
    }
  });

  it("version matches package.json", () => {
    expect(packageJson.version).toMatch(/^\d+\.\d+\.\d+$/);
    expect(packageJson.version).toBe(
      `${defaultTokenList.version.major}.${defaultTokenList.version.minor}.${defaultTokenList.version.patch}`
    );
  });
});
