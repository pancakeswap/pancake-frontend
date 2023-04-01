import { Percent } from "@pancakeswap/sdk";

export function getAccrued(principal: number, apy: Percent, stakeFor = 1) {
  const interestEarned = principal * parseFloat(apy.asFraction.toFixed(6)) * (stakeFor / 365);
  return principal + interestEarned;
}
