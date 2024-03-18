export function getAccrued(principal: number, apr: number, compoundEvery = 0, stakeFor = 1, compoundOn = false) {
  const daysAsDecimalOfYear = stakeFor / 365;
  const timesCompounded = 365 / compoundEvery;
  if (timesCompounded !== 0 && compoundEvery <= stakeFor && compoundOn) {
    return principal * (1 + apr / timesCompounded) ** (timesCompounded * daysAsDecimalOfYear);
  }

  return principal + principal * apr * daysAsDecimalOfYear; // simple calc when not compounding
}
