import { BigintIsh } from "@pancakeswap/sdk";

export interface PriceData {
  time: Date;
  value: number;
}

export interface TickData {
  tick: string;
  liquidityNet: BigintIsh;
  liquidityGross: BigintIsh;
}

export interface TickProcessed {
  tick: number;
  liquidityNet: bigint;
  liquidityActive: bigint;
  price0: string;
}
