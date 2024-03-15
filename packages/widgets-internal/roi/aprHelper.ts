import { Percent } from "@pancakeswap/sdk";
import { formatFraction } from "@pancakeswap/utils/formatFractions";

export function getAccrued(principal: number, apr: Percent, compoundEvery = 0, stakeFor = 1, compoundOn = false) {
  const aprAsDecimal = parseFloat(formatFraction(apr.asFraction, 6) || "0");
  const daysAsDecimalOfYear = stakeFor / 365;
  const timesCompounded = 365 / compoundEvery;
  if (timesCompounded !== 0 && compoundEvery <= stakeFor && compoundOn) {
    return principal * (1 + aprAsDecimal / timesCompounded) ** (timesCompounded * daysAsDecimalOfYear);
  }

  return principal + principal * aprAsDecimal * daysAsDecimalOfYear; // simple calc when not compounding
}
