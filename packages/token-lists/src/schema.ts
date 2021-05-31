import { schema } from "@uniswap/token-lists";

// Modifying maxLength of the token list name since
// "PancakeSwap Token List" doesn't fit into standard 20 characters.
schema.properties.name.maxLength = 32;
schema.definitions.TokenInfo.properties.symbol.pattern = "^[𝜏τa-zA-Z0-9+\\-%/\\$]+$";
schema.definitions.TokenInfo.properties.name.pattern = "^[ \\w.'+\\-%/𝜏τÀ-ÖØ-öø-ÿ\\:]+$";

export default schema;
