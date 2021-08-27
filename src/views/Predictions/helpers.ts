import { ethers } from 'ethers'
import { NodeRound } from 'state/types'
import { formatBigNumberToFixed } from 'utils/formatBalance'
import getTimePeriods from 'utils/getTimePeriods'

export const formatUsdv2 = (usd: ethers.BigNumber) => {
  return `$${formatBigNumberToFixed(usd, 3, 8)}`
}

export const formatBnbv2 = (bnb: ethers.BigNumber) => {
  const value = bnb || ethers.BigNumber.from(0)
  return formatBigNumberToFixed(value, 3)
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
