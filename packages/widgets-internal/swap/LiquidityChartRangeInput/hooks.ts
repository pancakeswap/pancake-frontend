import { Currency } from "@pancakeswap/sdk";
import { FeeAmount, TICK_SPACINGS, tickToPrice } from "@pancakeswap/v3-sdk";
import { useMemo } from "react";

import { ChartEntry, TickDataRaw, TickProcessed } from "./types";
import { computeSurroundingTicks } from "./utils";

const PRICE_FIXED_DIGITS = 8;

export function useDensityChartData(poolInfo: {
  liquidity?: bigint;
  tickCurrent?: number;
  feeAmount?: FeeAmount;
  currencyA?: Currency | null;
  currencyB?: Currency | null;
  ticks?: TickDataRaw[];
}) {
  const { data: ticks = [] } = usePoolActiveLiquidity(poolInfo);

  const formattedData = useMemo(() => {
    if (!ticks.length) {
      return undefined;
    }

    const newData: ChartEntry[] = [];

    for (let i = 0; i < ticks.length; i++) {
      const t = ticks[i];

      const chartEntry = {
        activeLiquidity: parseFloat(t.liquidityActive.toString()),
        price0: parseFloat(t.price0),
      };

      if (chartEntry.activeLiquidity > 0) {
        newData.push(chartEntry);
      }
    }

    return newData;
  }, [ticks]);

  return useMemo(() => {
    return {
      formattedData,
    };
  }, [formattedData]);
}

const getActiveTick = (tickCurrent: number | undefined, feeAmount: FeeAmount | undefined) =>
  typeof tickCurrent !== "undefined" && feeAmount
    ? Math.floor(tickCurrent / TICK_SPACINGS[feeAmount]) * TICK_SPACINGS[feeAmount]
    : undefined;

export function usePoolActiveLiquidity({
  liquidity,
  currencyA,
  currencyB,
  feeAmount,
  ticks = [],
  tickCurrent,
}: {
  liquidity?: bigint;
  tickCurrent?: number;
  feeAmount?: FeeAmount;
  currencyA?: Currency | null;
  currencyB?: Currency | null;
  ticks?: TickDataRaw[];
}): {
  activeTick?: number;
  data?: TickProcessed[];
} {
  // Find nearest valid tick for pool in case tick is not initialized.
  const activeTick = useMemo(() => getActiveTick(tickCurrent, feeAmount), [tickCurrent, feeAmount]);

  return useMemo(() => {
    if (!currencyA || !currencyB || activeTick === undefined || !ticks || ticks.length === 0) {
      return {
        activeTick,
        data: undefined,
      };
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
      return {
        activeTick,
        data: undefined,
      };
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

    return {
      activeTick,
      data: ticksProcessed,
    };
  }, [currencyA, currencyB, activeTick, ticks, liquidity]);
}
