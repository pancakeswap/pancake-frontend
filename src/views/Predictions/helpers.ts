import BigNumber from 'bignumber.js'
import { orderBy } from 'lodash'
import { RoundData } from 'state/types'
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

export const sortRounds = (rounds: RoundData, currentEpoch: number) => {
  const currentRound = rounds[currentEpoch]
  const roundArr = Object.values(rounds).filter((round) => round.epoch !== currentEpoch)
  const sortedRounds = orderBy(roundArr, ['epoch'], ['asc'])

  if (sortedRounds.length > 0) {
    const middleIndex = Math.floor(sortedRounds.length / 2)
    sortedRounds.splice(middleIndex, 0, currentRound)
  }

  return sortedRounds
}

export const padTime = (num: number) => num.toString().padStart(2, '0')
