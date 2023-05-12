import { BetPosition } from 'state/types'
import BN from 'bignumber.js'
import { formatBigIntToFixed } from '@pancakeswap/utils/formatBalance'
import getTimePeriods from '@pancakeswap/utils/getTimePeriods'
import memoize from 'lodash/memoize'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'

const abs = (n: bigint) => (n === -0n || n < 0n ? -n : n)

const calculateMinDisplayed = memoize(
  (decimals: number, displayedDecimals: number): bigint => {
    return 10n ** BigInt(decimals) / 10n ** BigInt(displayedDecimals)
  },
  (decimals, displayedDecimals) => `${decimals}#${displayedDecimals}`,
)

type formatPriceDifferenceProps = {
  price?: bigint
  minPriceDisplayed: bigint
  unitPrefix: string
  displayedDecimals: number
  decimals: number
}

const formatPriceDifference = ({
  price = 0n,
  minPriceDisplayed,
  unitPrefix,
  displayedDecimals,
  decimals,
}: formatPriceDifferenceProps) => {
  if (abs(price) < minPriceDisplayed) {
    const sign = price < 0n ? -1n : 1n
    const signedPriceToFormat = minPriceDisplayed * sign
    return `<${unitPrefix}${formatBigIntToFixed(signedPriceToFormat, displayedDecimals, decimals)}`
  }

  return `${unitPrefix}${formatBigIntToFixed(price, displayedDecimals, decimals)}`
}

export const formatUsdv2 = (usd: bigint, displayedDecimals: number) => {
  return formatPriceDifference({
    price: usd,
    minPriceDisplayed: calculateMinDisplayed(8, displayedDecimals),
    unitPrefix: '$',
    displayedDecimals,
    decimals: 8,
  })
}

export const formatTokenv2 = (token: bigint, decimals: number, displayedDecimals: number) => {
  return formatPriceDifference({
    price: token,
    minPriceDisplayed: calculateMinDisplayed(decimals, displayedDecimals),
    unitPrefix: '',
    displayedDecimals,
    decimals,
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

export const getMultiplierV2 = (total: bigint, amount: bigint) => {
  if (!total) {
    return BIG_ZERO
  }

  if (total === 0n || amount === 0n) {
    return BIG_ZERO
  }

  const rewardAmountFixed = new BN(total.toString())
  const multiplierAmountFixed = new BN(amount.toString())

  return rewardAmountFixed.div(multiplierAmountFixed)
}

export const getPriceDifference = (price: bigint, lockPrice: bigint) => {
  if (!price || !lockPrice) {
    return 0n
  }

  return price - lockPrice
}

export const getRoundPosition = (lockPrice: bigint, closePrice: bigint) => {
  if (!closePrice) {
    return null
  }

  if (closePrice === lockPrice) {
    return BetPosition.HOUSE
  }

  return closePrice > lockPrice ? BetPosition.BULL : BetPosition.BEAR
}

export const CHART_DOT_CLICK_EVENT = 'CHART_DOT_CLICK_EVENT'
