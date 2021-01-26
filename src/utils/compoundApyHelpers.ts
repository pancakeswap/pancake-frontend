export const calculateCakePerThousand = (numberOfDays, apy, cakePrice) => {
  const timesCompounded = 365
  const apyAsDecimal = apy / 100
  const daysAsDecimalOfYear = numberOfDays / 365
  const principal = 1000 * cakePrice

  const finalAmount = principal * Math.pow(1 + apyAsDecimal / timesCompounded, timesCompounded * daysAsDecimalOfYear) // eslint-disable-line no-restricted-properties
  const interestEarned = finalAmount - principal
  return interestEarned
}

export const apyModalRoi = (cakePerThousandDollars, costOfOneThousandCake) => {
  const percentage = (cakePerThousandDollars / costOfOneThousandCake) * 100
  return percentage.toFixed(2)
}
