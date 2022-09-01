import { BigNumber, FixedNumber } from '@ethersproject/bignumber'
import { BetPosition } from 'state/types'
import { formatBigNumberToFixed } from 'utils/formatBalance'
import getTimePeriods from 'utils/getTimePeriods'
import { NegativeOne, One, Zero } from '@ethersproject/constants'

const MIN_PRICE_BNB_DISPLAYED = BigNumber.from('1000000000000000')

type formatPriceDifferenceProps = {
  price?: BigNumber
  minPriceDisplayed: BigNumber
  unitPrefix: string
  displayedDecimals: number
  decimals: number
}

const formatPriceDifference = ({
  price = Zero,
  minPriceDisplayed,
  unitPrefix,
  displayedDecimals,
  decimals,
}: formatPriceDifferenceProps) => {
  const sign = price.isNegative() ? NegativeOne : One

  if (price.abs().lt(minPriceDisplayed)) {
    const signedPriceToFormat = minPriceDisplayed.mul(sign)
    return `<${unitPrefix}${formatBigNumberToFixed(signedPriceToFormat, displayedDecimals, decimals)}`
  }

  return `${unitPrefix}${formatBigNumberToFixed(price, displayedDecimals, decimals)}`
}

export const formatUsdv2 = (usd: BigNumber, minPriceDisplayed: BigNumber, displayedDecimals: number) => {
  return formatPriceDifference({ price: usd, minPriceDisplayed, unitPrefix: '$', displayedDecimals, decimals: 8 })
}

export const formatBnbv2 = (bnb: BigNumber, displayedDecimals: number) => {
  return formatPriceDifference({
    price: bnb,
    minPriceDisplayed: MIN_PRICE_BNB_DISPLAYED,
    unitPrefix: '',
    displayedDecimals,
    decimals: 18,
  })
}

export const padTime = (num: number) => num.toString().padStart(2, '0')

export const formatRoundTime = (secondsBetweenBlocks: number) => {
  const { hours, minutes, seconds } = getTimePeriods(secondsBetweenBlocks)
  const minutesSeconds = `${padTime(minutes)}:${padTime(seconds)}`

  if (hours > 0) {
    return `${padTime(hours)}:${minutesSeconds}`
  }

  return minutesSeconds
}

export const getMultiplierV2 = (total: BigNumber, amount: BigNumber) => {
  if (!total) {
    return FixedNumber.from(0)
  }

  if (total.eq(0) || amount.eq(0)) {
    return FixedNumber.from(0)
  }

  const rewardAmountFixed = FixedNumber.from(total)
  const multiplierAmountFixed = FixedNumber.from(amount)

  return rewardAmountFixed.divUnsafe(multiplierAmountFixed)
}

export const getPriceDifference = (price: BigNumber, lockPrice: BigNumber) => {
  if (!price || !lockPrice) {
    return Zero
  }

  return price.sub(lockPrice)
}

export const getRoundPosition = (lockPrice: BigNumber, closePrice: BigNumber) => {
  if (!closePrice) {
    return null
  }

  if (closePrice.eq(lockPrice)) {
    return BetPosition.HOUSE
  }

  return closePrice.gt(lockPrice) ? BetPosition.BULL : BetPosition.BEAR
}

export const CHART_DOT_CLICK_EVENT = 'CHART_DOT_CLICK_EVENT'
