const roundToTwoDp = (number) => Math.round(number * 100) / 100

export const tokenEarnedPerThousandDollarsCompounding = ({ numberOfDays, farmApr, tokenPrice }) => {
  // Everything here is worked out relative to a year, with the asset compounding daily
  const timesCompounded = 365
  // We use decimal values rather than % in the math for both APY and the number of days being calculates as a proportion of the year
  const aprAsDecimal = farmApr / 100
  const daysAsDecimalOfYear = numberOfDays / timesCompounded
  // Calculate the starting TOKEN balance with a dollar balance of $1000.
  const principal = 1000 / tokenPrice
  // This is a translation of the typical mathematical compounding APY formula. Details here: https://www.calculatorsoup.com/calculators/financial/compound-interest-calculator.php
  const finalAmount = principal * (1 + aprAsDecimal / timesCompounded) ** (timesCompounded * daysAsDecimalOfYear)
  // To get the TOKEN amount earned, deduct the amount after compounding (finalAmount) from the starting TOKEN balance (principal)
  const interestEarned = finalAmount - principal
  return roundToTwoDp(interestEarned)
}

export const getRoi = ({ amountEarned, amountInvested }) => {
  const percentage = (amountEarned / amountInvested) * 100
  return percentage.toFixed(2)
}
