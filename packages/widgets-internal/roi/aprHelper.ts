import BigNumber from "bignumber.js";

export function getAccrued(principal: number, apr: number, compoundEvery = 0, stakeFor = 1) {
  const daysAsDecimalOfYear = stakeFor / 365;
  const timesCompounded = 365 / compoundEvery;
  const bigPrincipal = new BigNumber(parseFloat(principal.toFixed(4)) * 10000).div(10000);
  const bigApr = new BigNumber(parseFloat(apr.toFixed(4)) * 10000).div(10000);
  const bigTimesCompounded = new BigNumber(parseFloat(timesCompounded.toFixed(4)) * 10000).div(10000);
  const bigDaysAsDecimalOfYear = new BigNumber(parseFloat(daysAsDecimalOfYear.toFixed(4)) * 10000).div(10000);

  if (compoundEvery !== 0 && timesCompounded !== 0 && compoundEvery <= stakeFor) {
    const part1 = bigApr.div(bigTimesCompounded).plus(1);
    const part2 = bigTimesCompounded.times(bigDaysAsDecimalOfYear).toNumber().toFixed(0);
    const part3 = bigPrincipal;
    return part1.pow(part2).times(part3).toNumber();
  }

  return bigPrincipal.plus(bigPrincipal.times(bigApr).times(bigDaysAsDecimalOfYear)).toNumber(); // simple calc when not compounding
}
