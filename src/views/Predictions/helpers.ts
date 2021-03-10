import BigNumber from 'bignumber.js'
import { getBalanceAmount } from 'utils/formatBalance'

export const getUsdAmount = (usdBn: BigNumber) => {
  return getBalanceAmount(usdBn, 8)
}

export const getBnbAmount = (bnbBn: BigNumber) => {
  return getBalanceAmount(bnbBn, 18)
}

export const formatUsd = (usd: number) => {
  return `$${usd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export const formatBnb = (bnb: number) => {
  return bnb.toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 })
}

export const formatUsdFromBigNumber = (usdBn: BigNumber) => {
  return formatUsd(getUsdAmount(usdBn).toNumber())
}

export const formatBnbFromBigNumber = (bnbBn: BigNumber) => {
  return formatBnb(getBnbAmount(bnbBn).toNumber())
}

export const formatRoundPriceDifference = (lockPrice: BigNumber, closePrice: BigNumber) => {
  return formatUsdFromBigNumber(closePrice.minus(lockPrice))
}
