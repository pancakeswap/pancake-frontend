import { Percent } from "@pancakeswap/sdk";
import { formatFraction } from "@pancakeswap/utils/formatFractions";

export function getAccrued(principal: number, apr: Percent, timesCompounded?: number, stakeFor = 1) {
  const aprAsDecimal = parseFloat(formatFraction(apr.asFraction, 6) || "0");
  const daysAsDecimalOfYear = stakeFor / 365;
  if (timesCompounded && timesCompounded >= stakeFor) {
    return principal * (1 + aprAsDecimal / timesCompounded) ** (timesCompounded * daysAsDecimalOfYear);
  }
  return principal * aprAsDecimal * daysAsDecimalOfYear; // simple calc when not compounding
}
