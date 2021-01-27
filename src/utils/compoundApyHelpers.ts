export const calculateCakePerThousand = (numberOfDays, apy, cakePrice) => {
  const timesCompounded = 365
  const apyAsDecimal = apy / 100
  const daysAsDecimalOfYear = numberOfDays / timesCompounded
  const principal = 1000 / cakePrice

  const finalAmount = principal * (1 + apyAsDecimal / timesCompounded) ** (timesCompounded * daysAsDecimalOfYear)
  const interestEarned = finalAmount - principal
  return interestEarned
}

export const apyModalRoi = (cakePerThousandDollars, costOfOneThousandCake) => {
  const percentage = (cakePerThousandDollars / costOfOneThousandCake) * 100
  return percentage.toFixed(2)
}
