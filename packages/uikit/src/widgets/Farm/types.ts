import { ReactNode } from "react";
import BigNumber from "bignumber.js";
import { Token } from "@pancakeswap/sdk";

export interface FarmTableEarnedProps {
  earnings: number;
  pid: number;
}

export interface FarmTableLiquidityProps {
  liquidity: BigNumber;
}

export interface FarmTableMultiplierProps {
  multiplier: string;
  rewardCakePerSecond?: boolean;
}

export interface FarmTableFarmTokenInfoProps {
  label: string;
  pid: number;
  token: Token;
  quoteToken: Token;
  isReady: boolean;
  isStable?: boolean;
  stakedBalance?: BigNumber;
  children?: ReactNode;
}
