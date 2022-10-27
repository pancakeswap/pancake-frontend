import BigNumber from "bignumber.js";

export interface FarmTableEarnedProps {
  earnings: number;
  pid: number;
}

export interface FarmTableLiquidityProps {
  liquidity: BigNumber;
}

export interface FarmTableMultiplierProps {
  multiplier: string;
}
