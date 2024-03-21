export function getAccrued(principal: number, apr: number, compoundEvery = 0, stakeFor = 1) {
  const daysAsDecimalOfYear = stakeFor / 365;
  const timesCompounded = 365 / compoundEvery;
  const convertedPrincipal = principal < 0 ? 0 : principal;
  const convertedApr = apr < 0 ? 0 : apr;

  if (compoundEvery !== 0 && timesCompounded !== 0 && compoundEvery <= stakeFor) {
    return convertedPrincipal * (1 + convertedApr / timesCompounded) ** (timesCompounded * daysAsDecimalOfYear);
  }

  return convertedPrincipal + convertedPrincipal * convertedApr * daysAsDecimalOfYear; // simple calc when not compounding
}
