import BigNumber from 'bignumber.js'
import { BigNumber as EthersBigNumber, FixedNumber } from '@ethersproject/bignumber'
import { formatUnits } from '@ethersproject/units'
import { getLanguageCodeFromLS } from '@pancakeswap/localization'
import { getFullDecimalMultiplier } from './getFullDecimalMultiplier'

/**
 * Take a formatted amount, e.g. 15 BNB and convert it to full decimal value, e.g. 15000000000000000
 */
export const getDecimalAmount = (amount: BigNumber, decimals = 18) => {
  return new BigNumber(amount).times(getFullDecimalMultiplier(decimals))
}

export const getBalanceAmount = (amount: BigNumber, decimals = 18) => {
  return new BigNumber(amount).dividedBy(getFullDecimalMultiplier(decimals))
}

/**
 * This function is not really necessary but is used throughout the site.
 */
export const getBalanceNumber = (balance: BigNumber, decimals = 18) => {
  return getBalanceAmount(balance, decimals).toNumber()
}

export const getFullDisplayBalance = (balance: BigNumber, decimals = 18, displayDecimals?: number): string => {
  return getBalanceAmount(balance, decimals).toFixed(displayDecimals)
}

/**
 * Don't use the result to convert back to number.
 * It uses undefined locale which uses host language as a result.
 * Languages have different decimal separators which results in inconsistency when converting back this result to number.
 */
export const formatNumber = (number: number, minPrecision = 2, maxPrecision = 2) => {
  const options = {
    minimumFractionDigits: minPrecision,
    maximumFractionDigits: maxPrecision,
  }
  return number.toLocaleString(undefined, options)
}

/**
 * Method to format the display of wei given an EthersBigNumber object
 * Note: does NOT round
 */
export const formatBigNumber = (number: EthersBigNumber, displayDecimals = 18, decimals = 18) => {
  const remainder = number.mod(EthersBigNumber.from(10).pow(decimals - displayDecimals))
  return formatUnits(number.sub(remainder), decimals)
}

export const formatLpBalance = (balance: BigNumber) => {
  const stakedBalanceBigNumber = getBalanceAmount(balance)
  if (stakedBalanceBigNumber.gt(0) && stakedBalanceBigNumber.lt(0.00001)) {
    return '< 0.00001'
  }
  return stakedBalanceBigNumber.toFixed(5, BigNumber.ROUND_DOWN)
}
