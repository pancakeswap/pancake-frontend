import { BigintIsh, JSBI } from "@pancakeswap/sdk";

export interface TickData {
  tick: number;
  liquidityNet: BigintIsh;
  liquidityGross: BigintIsh;
}

export interface TickProcessed {
  tick: number;
  liquidityNet: JSBI;
  liquidityActive: JSBI;
  price0: string;
}
