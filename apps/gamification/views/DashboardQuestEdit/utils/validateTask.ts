import BigNumber from 'bignumber.js'

export const validateMinAmount = (minAmount: string) => {
  return !minAmount || new BigNumber(minAmount ?? 0).lte(0)
}
