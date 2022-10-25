import { Bet, BetPosition } from 'state/types'
import { formatNumber } from '@pancakeswap/utils/formatBalance'

export const formatUsd = (usd: number, displayedDecimals: number) => {
  return `$${formatNumber(usd || 0, displayedDecimals, displayedDecimals)}`
}

export const formatBnb = (bnb: number, displayedDecimals: number) => {
  return bnb
    ? bnb.toLocaleString(undefined, {
        minimumFractionDigits: displayedDecimals,
        maximumFractionDigits: displayedDecimals,
      })
    : '0'
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
