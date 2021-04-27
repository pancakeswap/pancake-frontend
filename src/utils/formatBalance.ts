import BigNumber from 'bignumber.js'
import { BIG_TEN } from './bigNumber'

export const getBalanceNumber = (balance: BigNumber, decimals = 18) => {
  const displayBalance = new BigNumber(balance).dividedBy(BIG_TEN.pow(decimals))
  return displayBalance.toNumber()
}

export const getFullDisplayBalance = (balance: BigNumber, decimals = 18, decimalsToAppear?: number) => {
  return balance.dividedBy(BIG_TEN.pow(decimals)).toFixed(decimalsToAppear)
}

export const formatNumber = (number: number, minPrecision = 2, maxPrecision = 2) => {
  const options = {
    minimumFractionDigits: minPrecision,
    maximumFractionDigits: maxPrecision,
  }
  return number.toLocaleString(undefined, options)
}
