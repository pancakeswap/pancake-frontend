import { Bet, BetPosition } from 'state/types'
import { formatNumber } from 'utils/formatBalance'

export const formatUsd = (usd: number, locales: string) => {
  return `$${formatNumber(usd || 0, 3, 3, locales)}`
}

export const formatBnb = (bnb: number, locales: string) => {
  return bnb ? bnb.toLocaleString(locales, { minimumFractionDigits: 3, maximumFractionDigits: 3 }) : '0'
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
