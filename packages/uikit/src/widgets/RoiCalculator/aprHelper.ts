import { Percent } from "@pancakeswap/sdk";
import { formatPercent } from "@pancakeswap/utils/formatFractions";

export function getAccrued(principal: number, apy: Percent, stakeFor = 1) {
  const interestEarned = principal * parseFloat(formatPercent(apy, 6) || "0") * (stakeFor / 365);
  return principal + interestEarned;
}
