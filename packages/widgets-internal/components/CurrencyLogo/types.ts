import type { Address } from "viem";

export type CurrencyInfo = {
  address?: Address;
  symbol?: string;
  chainId?: number;
  isToken?: boolean;
  isNative?: boolean;
};
