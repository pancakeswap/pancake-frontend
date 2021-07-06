import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'
import { Bet, BetPosition, NodeLedger, NodeRound } from 'state/types'
import { DefaultTheme } from 'styled-components'
import { formatBigNumberToFixed, formatNumber, getBalanceAmount } from 'utils/formatBalance'
import getTimePeriods from 'utils/getTimePeriods'

export const getBnbAmount = (bnbBn: BigNumber) => {
  return getBalanceAmount(bnbBn, 18)
}

export const formatUsd = (usd: number) => {
  return `$${formatNumber(usd || 0, 3, 3)}`
}

export const formatUsdv2 = (usd: ethers.BigNumber) => {
  return `$${formatBigNumberToFixed(usd, 3, 8)}`
}

export const formatBnb = (bnb: number) => {
  return bnb ? bnb.toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 }) : '0'
}

export const formatBnbv2 = (bnb: ethers.BigNumber) => {
  const value = bnb || ethers.BigNumber.from(0)
  return formatBigNumberToFixed(value, 4)
}

export const formatBnbFromBigNumber = (bnbBn: BigNumber) => {
  return formatBnb(getBnbAmount(bnbBn).toNumber())
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

export const getMultiplier = (total: number, amount: number) => {
  if (total === 0 || amount === 0) {
    return 0
  }

  return total / amount
}

/**
 * Calculates the total payout given a bet
 */
export const getPayout = (bet: Bet, rewardRate = 1) => {
  if (!bet || !bet.round) {
    return 0
  }

  const { bullAmount, bearAmount, totalAmount } = bet.round
  const multiplier = getMultiplier(totalAmount, bet.position === BetPosition.BULL ? bullAmount : bearAmount)
  return bet.amount * multiplier * rewardRate
}

export const getNetPayout = (bet: Bet, rewardRate = 1): number => {
  if (!bet || !bet.round) {
    return 0
  }

  const payout = getPayout(bet, rewardRate)
  return payout - bet.amount
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

export const getMultiplierv2 = (total: NodeRound['totalAmount'], amount: ethers.BigNumber) => {
  if (!total) {
    return 0
  }

  if (total.eq(0) || amount.eq(0)) {
    return 0
  }

  const fixedTotal = ethers.FixedNumber.from(total)
  const fixedAmount = ethers.FixedNumber.from(amount)

  return fixedTotal.divUnsafe(fixedAmount).toUnsafeFloat()
}

export const getPayoutv2 = (ledger: NodeLedger, round: NodeRound, rewardRate = 1) => {
  if (!ledger) {
    return ethers.BigNumber.from(0)
  }

  const { bullAmount, bearAmount, totalAmount } = round
  const multiplier = getMultiplierv2(totalAmount, ledger.position === BetPosition.BULL ? bullAmount : bearAmount)

  return bearAmount.mul(multiplier).mul(rewardRate)
}

export const getNetPayoutv2 = (ledger: NodeLedger, round: NodeRound, rewardRate = 1) => {
  if (!ledger) {
    return ethers.BigNumber.from(0)
  }

  const payout = getPayoutv2(ledger, round, rewardRate)
  return payout.sub(ledger.amount)
}
