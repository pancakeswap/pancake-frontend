import { Percent } from "@pancakeswap/sdk";

export function getAccrued(principal: number, apy: Percent, stakeFor = 1) {
  return principal * (1 + parseFloat(apy.asFraction.toSignificant(6))) ** (stakeFor / 365);
}
