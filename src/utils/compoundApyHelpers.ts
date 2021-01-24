export const calculateApy = (principal, numberOfDays, apy) => {
  const timesCompounded = 365
  const apyAsDecimal = apy / 100
  const daysAsDecimalOfYear = numberOfDays / 365

  const finalAmount = principal * Math.pow(1 + apyAsDecimal / timesCompounded, timesCompounded * daysAsDecimalOfYear) // eslint-disable-line no-restricted-properties
  const interestEarned = finalAmount - principal
  return interestEarned
}

export const someOtherFunc = () => {
  return null
}
