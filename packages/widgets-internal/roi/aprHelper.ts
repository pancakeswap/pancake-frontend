export function getAccrued(principal: number, apr: number, compoundEvery = 0, stakeFor = 1) {
  const daysAsDecimalOfYear = stakeFor / 365;
  const timesCompounded = 365 / compoundEvery;
  if (compoundEvery !== 0 && timesCompounded !== 0 && compoundEvery <= stakeFor) {
    return principal * (1 + apr / timesCompounded) ** (timesCompounded * daysAsDecimalOfYear);
  }

  return principal + principal * apr * daysAsDecimalOfYear; // simple calc when not compounding
}
