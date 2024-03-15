import { Percent } from "@pancakeswap/sdk";
import { formatFraction } from "@pancakeswap/utils/formatFractions";

export function getAccrued(principal: number, apr: Percent, timesCompounded = 0, stakeFor = 1) {
  const aprAsDecimal = parseFloat(formatFraction(apr.asFraction, 6) || "0");
  const daysAsDecimalOfYear = stakeFor / 365;
  const compoundEvery = 365 / timesCompounded;
  if (timesCompounded !== 0 && compoundEvery <= stakeFor) {
    return principal * (1 + aprAsDecimal / timesCompounded) ** (timesCompounded * daysAsDecimalOfYear);
  }
  return principal + principal * aprAsDecimal * daysAsDecimalOfYear; // simple calc when not compounding
}
