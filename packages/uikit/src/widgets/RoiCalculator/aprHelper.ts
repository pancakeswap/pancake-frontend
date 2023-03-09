import { Percent } from "@pancakeswap/sdk";

export function getAccrued(principal: number, apr: Percent, stakeFor = 1) {
  return principal * (1 + parseFloat(apr.asFraction.toSignificant(6))) ** (stakeFor / 365);
}
