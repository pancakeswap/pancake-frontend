import BigNumber from 'bignumber.js'

export const validateNumber = (amount: string) => {
  return !amount || new BigNumber(amount ?? 0).lte(0)
}
