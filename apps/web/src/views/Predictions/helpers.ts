import { BetPosition } from '@pancakeswap/prediction'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { formatBigIntToFixed } from '@pancakeswap/utils/formatBalance'
import getTimePeriods from '@pancakeswap/utils/getTimePeriods'
import BN from 'bignumber.js'
import memoize from 'lodash/memoize'

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

export const getPriceDifference = (price: bigint | null, lockPrice: bigint | null) => {
  if (!price || !lockPrice) {
    return 0n
  }

  return price - lockPrice
}

export const getRoundPosition = (
  lockPrice?: bigint | number | null,
  closePrice?: bigint | number | null,
  AIPrice?: bigint | number | null,
) => {
  if (!closePrice || !lockPrice) {
    return null
  }

  // If AI-based prediction
  if (AIPrice) {
    if (
      (closePrice > lockPrice && AIPrice > lockPrice) ||
      (closePrice < lockPrice && AIPrice < lockPrice) ||
      (closePrice === lockPrice && AIPrice === lockPrice)
    ) {
      return BetPosition.BULL
    }

    return BetPosition.BEAR
  }

  // If not AI-based prediction
  if (closePrice === lockPrice) {
    return BetPosition.HOUSE
  }

  return closePrice > lockPrice ? BetPosition.BULL : BetPosition.BEAR
}

export const CHART_DOT_CLICK_EVENT = 'CHART_DOT_CLICK_EVENT'
