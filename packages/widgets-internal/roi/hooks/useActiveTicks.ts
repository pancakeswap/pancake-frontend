import { Currency } from "@pancakeswap/sdk";
import { tickToPrice } from "@pancakeswap/v3-sdk";
import { useMemo } from "react";

import { PRICE_FIXED_DIGITS } from "../constants";
import { TickData, TickProcessed } from "../types";
import { computeSurroundingTicks } from "../utils";

interface Props {
  currencyA?: Currency;
  currencyB?: Currency;
  ticks?: TickData[];
  liquidity?: bigint;
  tickCurrent?: number;
}

export function useActiveTicks({ currencyA, currencyB, ticks, liquidity, tickCurrent: activeTick }: Props) {
  return useMemo(() => {
    if (!currencyA || !currencyB || activeTick === undefined || !liquidity || !ticks || ticks.length === 0) {
      return undefined;
    }

    const token0 = currencyA?.wrapped;
    const token1 = currencyB?.wrapped;

    // find where the active tick would be to partition the array
    // if the active tick is initialized, the pivot will be an element
    // if not, take the previous tick as pivot
    const pivot = ticks.findIndex(({ tick }) => Number(tick) > activeTick) - 1;

    if (pivot < 0) {
      // consider setting a local error
      console.error("TickData pivot not found");
      return undefined;
    }

    const activeTickProcessed: TickProcessed = {
      liquidityActive: BigInt(liquidity ?? 0),
      tick: activeTick,
      liquidityNet: Number(ticks[pivot].tick) === activeTick ? BigInt(ticks[pivot].liquidityNet) : 0n,
      price0: tickToPrice(token0, token1, activeTick).toFixed(PRICE_FIXED_DIGITS),
    };

    const subsequentTicks = computeSurroundingTicks(token0, token1, activeTickProcessed, ticks, pivot, true);

    const previousTicks = computeSurroundingTicks(token0, token1, activeTickProcessed, ticks, pivot, false);

    const ticksProcessed = previousTicks.concat(activeTickProcessed).concat(subsequentTicks);

    return ticksProcessed;
  }, [currencyA, currencyB, activeTick, liquidity, ticks]);
}
