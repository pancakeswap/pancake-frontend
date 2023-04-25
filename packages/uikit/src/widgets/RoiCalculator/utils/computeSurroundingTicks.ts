import { Token } from "@pancakeswap/sdk";
import { tickToPrice } from "@pancakeswap/v3-sdk";

import { PRICE_FIXED_DIGITS } from "../constants";
import { TickProcessed, TickData } from "../types";

// Computes the numSurroundingTicks above or below the active tick.
export function computeSurroundingTicks(
  token0: Token,
  token1: Token,
  activeTickProcessed: TickProcessed,
  sortedTickData: TickData[],
  pivot: number,
  ascending: boolean
): TickProcessed[] {
  let previousTickProcessed: TickProcessed = {
    ...activeTickProcessed,
  };
  // Iterate outwards (either up or down depending on direction) from the active tick,
  // building active liquidity for every tick.
  let processedTicks: TickProcessed[] = [];
  for (let i = pivot + (ascending ? 1 : -1); ascending ? i < sortedTickData.length : i >= 0; ascending ? i++ : i--) {
    const tick = Number(sortedTickData[i].tick);
    const currentTickProcessed: TickProcessed = {
      liquidityActive: previousTickProcessed.liquidityActive,
      tick,
      liquidityNet: BigInt(sortedTickData[i].liquidityNet),
      price0: tickToPrice(token0, token1, tick).toFixed(PRICE_FIXED_DIGITS),
    };

    // Update the active liquidity.
    // If we are iterating ascending and we found an initialized tick we immediately apply
    // it to the current processed tick we are building.
    // If we are iterating descending, we don't want to apply the net liquidity until the following tick.
    if (ascending) {
      currentTickProcessed.liquidityActive =
        previousTickProcessed.liquidityActive + BigInt(sortedTickData[i].liquidityNet);
    } else if (!ascending && previousTickProcessed.liquidityNet !== 0n) {
      // We are iterating descending, so look at the previous tick and apply any net liquidity.
      currentTickProcessed.liquidityActive = previousTickProcessed.liquidityActive - previousTickProcessed.liquidityNet;
    }

    processedTicks.push(currentTickProcessed);
    previousTickProcessed = currentTickProcessed;
  }

  if (!ascending) {
    processedTicks = processedTicks.reverse();
  }

  return processedTicks;
}
