import { ethers } from 'ethers'
import { BetPosition, NodeLedger, NodeRound } from 'state/types'
import { formatBigNumber, formatBigNumberToFixed } from 'utils/formatBalance'
import getTimePeriods from 'utils/getTimePeriods'

export const formatUsdv2 = (usd: ethers.BigNumber) => {
  return `$${formatBigNumberToFixed(usd, 3, 8)}`
}

export const formatBnbv2 = (bnb: ethers.BigNumber) => {
  const value = bnb || ethers.BigNumber.from(0)
  return formatBigNumberToFixed(value, 4)
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

export const getHasRoundFailed = (round: NodeRound, blockNumber: number) => {
  if (!round.endBlock) {
    return false
  }

  // Round hasn't finished yet
  if (round.endBlock >= blockNumber) {
    return false
  }

  // If the round is finished and the oracle has not been called we know it has failed
  return round.oracleCalled === false
}

export const getMultiplierv2 = (total: ethers.BigNumber, amount: ethers.BigNumber) => {
  if (!total) {
    return '0'
  }

  if (total.eq(0) || amount.eq(0)) {
    return '0'
  }

  const rewardAmountFixed = ethers.FixedNumber.from(total)
  const multiplierAmountFixed = ethers.FixedNumber.from(amount)

  return rewardAmountFixed.divUnsafe(multiplierAmountFixed).toString()
}

export const formatMultiplierv2 = (value: string) => {
  const valueUnit = ethers.utils.parseUnits(value, 18)
  return formatBigNumber(valueUnit, 2, 18)
}

export const getPayoutv2 = (ledger: NodeLedger, round: NodeRound) => {
  if (!ledger || !round) {
    return '0'
  }

  const { bullAmount, bearAmount, rewardAmount } = round
  const { amount, position } = ledger

  const amountFixed = ethers.FixedNumber.from(formatBigNumber(amount))
  const multiplier = ethers.FixedNumber.fromString(
    getMultiplierv2(rewardAmount, position === BetPosition.BULL ? bullAmount : bearAmount),
  )

  return amountFixed.mulUnsafe(multiplier).toString()
}
