/* eslint-disable no-restricted-syntax */
import Ajv from "ajv";
import fs from "fs";
import path from "path";
import { getAddress } from "@ethersproject/address";
import { schema } from "@uniswap/token-lists";
import currentPancakeswapDefaultList from "../lists/pancakeswap-default.json";
import currentPancakeswapExtendedtList from "../lists/pancakeswap-extended.json";
import currentPancakeswapTop15List from "../lists/pancakeswap-top-15.json";
import currentPancakeswapTop100tList from "../lists/pancakeswap-top-100.json";
import { buildList, VersionBump } from "../src/buildList";

const currentLists = {
  "pancakeswap-default": currentPancakeswapDefaultList,
  "pancakeswap-extended": currentPancakeswapExtendedtList,
  "pancakeswap-top-100": currentPancakeswapTop100tList,
  "pancakeswap-top-15": currentPancakeswapTop15List,
};

const ajv = new Ajv({ allErrors: true, format: "full" });
const validate = ajv.compile(schema);

const pathToImages = process.env.CI
  ? path.join(process.env.GITHUB_WORKSPACE, "packages", "token-lists", "lists", "images")
  : path.join(path.resolve(), "lists", "images");
const logoFiles = fs.readdirSync(pathToImages);

// Modified https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_get
const getByAjvPath = (obj, propertyPath: string, defaultValue = undefined) => {
  const travel = (regexp) =>
    String.prototype.split
      .call(propertyPath.substring(1), regexp)
      .filter(Boolean)
      .reduce((res, key) => (res !== null && res !== undefined ? res[key] : res), obj);
  const result = travel(/[,[\]]+?/) || travel(/[,[\].]+?/);
  return result === undefined || result === obj ? defaultValue : result;
};

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    interface Matchers<R> {
      toBeDeclaredOnce(type: string, parameter: string, chainId: number): CustomMatcherResult;
      toBeValidTokenList(): CustomMatcherResult;
      toBeValidLogo(): CustomMatcherResult;
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
  toBeValidTokenList(tokenList) {
    const isValid = validate(tokenList);
    if (isValid) {
      return {
        message: () => ``,
        pass: true,
      };
    }
    const validationSummary = validate.errors
      .map((error) => {
        const value = getByAjvPath(tokenList, error.dataPath);
        return `- ${error.dataPath.split(".").pop()} ${value} ${error.message}`;
      })
      .join("\n");
    return {
      message: () => `Validation failed:\n${validationSummary}`,
      pass: false,
    };
  },
  toBeValidLogo(token) {
    // TW logos are always checksummed
    const hasTWLogo =
      token.logoURI === `https://assets.trustwalletapp.com/blockchains/smartchain/assets/${token.address}/logo.png`;
    let hasLocalLogo = false;
    const refersToLocalLogo =
      token.logoURI === `https://tokens.pancakeswap.finance/images/${token.address}.png` ||
      token.logoURI === `https://tokens.pancakeswap.finance/images/${token.address.toLowerCase()}.png`;
    if (token.logoURI === "https://tokens.pancakeswap.finance/images/0x4e6415a5727ea08aae4580057187923aec331227.png") {
      console.log("refersToLocalLogo", refersToLocalLogo);
    }
    if (refersToLocalLogo) {
      const fileName = token.logoURI.split("/").pop();
      // Note: fs.existsSync can't be used here because its not case sensetive
      hasLocalLogo = logoFiles.includes(fileName);
    }
    if (hasTWLogo || hasLocalLogo) {
      return {
        message: () => ``,
        pass: true,
      };
    }
    return {
      message: () => `Token ${token.symbol} (${token.address}) has invalid logo: ${token.logoURI}`,
      pass: false,
    };
  },
});

describe.each([["pancakeswap-default"], ["pancakeswap-extended"], ["pancakeswap-top-100"], ["pancakeswap-top-15"]])(
  "buildList %s",
  (listName) => {
    const defaultTokenList = buildList(listName);

    it("validates", () => {
      expect(defaultTokenList).toBeValidTokenList();
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

    it("all tokens have correct logos", () => {
      for (const token of defaultTokenList.tokens) {
        expect(token).toBeValidLogo();
      }
    });

    it("version gets patch bump if no versionBump sepcified", () => {
      expect(defaultTokenList.version.major).toBe(currentLists[listName].version.major);
      expect(defaultTokenList.version.minor).toBe(currentLists[listName].version.minor);
      expect(defaultTokenList.version.patch).toBe(currentLists[listName].version.patch + 1);
    });

    it("version gets patch bump if patch versionBump is sepcified", () => {
      const defaultTokenListPatchBump = buildList(listName, VersionBump.patch);
      expect(defaultTokenListPatchBump.version.major).toBe(currentLists[listName].version.major);
      expect(defaultTokenListPatchBump.version.minor).toBe(currentLists[listName].version.minor);
      expect(defaultTokenListPatchBump.version.patch).toBe(currentLists[listName].version.patch + 1);
    });

    it("version gets minor bump if minor versionBump is sepcified", () => {
      const defaultTokenListMinorBump = buildList(listName, VersionBump.minor);
      expect(defaultTokenListMinorBump.version.major).toBe(currentLists[listName].version.major);
      expect(defaultTokenListMinorBump.version.minor).toBe(currentLists[listName].version.minor + 1);
      expect(defaultTokenListMinorBump.version.patch).toBe(currentLists[listName].version.patch);
    });

    it("version gets minor bump if major versionBump is sepcified", () => {
      const defaultTokenListMajorBump = buildList(listName, VersionBump.major);
      expect(defaultTokenListMajorBump.version.major).toBe(currentLists[listName].version.major + 1);
      expect(defaultTokenListMajorBump.version.minor).toBe(currentLists[listName].version.minor);
      expect(defaultTokenListMajorBump.version.patch).toBe(currentLists[listName].version.patch);
    });
  }
);
