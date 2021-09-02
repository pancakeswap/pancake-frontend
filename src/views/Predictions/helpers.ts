import { BigNumber, ethers } from 'ethers'
import { BetPosition, NodeRound } from 'state/types'
import { formatBigNumberToFixed } from 'utils/formatBalance'
import getTimePeriods from 'utils/getTimePeriods'

const MIN_PRICE_USD_DISPLAYED = BigNumber.from(100000)
const MIN_PRICE_BNB_DISPLAYED = BigNumber.from('1000000000000000')
const DISPLAYED_DECIMALS = 3

type formatPriceDifferenceProps = {
  price?: BigNumber
  minPriceDisplayed: BigNumber
  unitPrefix: string
  decimals: number
}

const formatPriceDifference = ({
  price = BigNumber.from(0),
  minPriceDisplayed,
  unitPrefix,
  decimals,
}: formatPriceDifferenceProps) => {
  const sign = price.isNegative() ? BigNumber.from(-1) : BigNumber.from(1)

  if (price.abs().lt(minPriceDisplayed)) {
    const signedPriceToFormat = minPriceDisplayed.mul(sign)
    return `<${unitPrefix}${formatBigNumberToFixed(signedPriceToFormat, DISPLAYED_DECIMALS, decimals)}`
  }

  return `${unitPrefix}${formatBigNumberToFixed(price, DISPLAYED_DECIMALS, decimals)}`
}

export const formatUsdv2 = (usd: BigNumber) => {
  return formatPriceDifference({ price: usd, minPriceDisplayed: MIN_PRICE_USD_DISPLAYED, unitPrefix: '$', decimals: 8 })
}

export const formatBnbv2 = (bnb: BigNumber) => {
  return formatPriceDifference({ price: bnb, minPriceDisplayed: MIN_PRICE_BNB_DISPLAYED, unitPrefix: '', decimals: 18 })
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

export const getHasRoundFailed = (round: NodeRound, buffer: number) => {
  const closeTimestampMs = (round.closeTimestamp + buffer) * 1000
  const now = Date.now()

  if (closeTimestampMs !== null && now > closeTimestampMs && !round.oracleCalled) {
    return true
  }

  return false
}

export const getMultiplierv2 = (total: ethers.BigNumber, amount: ethers.BigNumber) => {
  if (!total) {
    return ethers.FixedNumber.from(0)
  }

  if (total.eq(0) || amount.eq(0)) {
    return ethers.FixedNumber.from(0)
  }

  const rewardAmountFixed = ethers.FixedNumber.from(total)
  const multiplierAmountFixed = ethers.FixedNumber.from(amount)

  return rewardAmountFixed.divUnsafe(multiplierAmountFixed)
}

export const getPriceDifference = (price: ethers.BigNumber, lockPrice: ethers.BigNumber) => {
  if (!price || !lockPrice) {
    return ethers.BigNumber.from(0)
  }

  return price.sub(lockPrice)
}

export const getRoundPosition = (lockPrice: ethers.BigNumber, closePrice: ethers.BigNumber) => {
  if (!closePrice) {
    return null
  }

  if (closePrice.eq(lockPrice)) {
    return BetPosition.HOUSE
  }

  return closePrice.gt(lockPrice) ? BetPosition.BULL : BetPosition.BEAR
}
