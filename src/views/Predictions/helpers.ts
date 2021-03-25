import BigNumber from 'bignumber.js'
import { Round } from 'state/types'
import { DefaultTheme } from 'styled-components'
import { getBalanceAmount } from 'utils/formatBalance'
import getTimePeriods from 'utils/getTimePeriods'

export const getBnbAmount = (bnbBn: BigNumber) => {
  return getBalanceAmount(bnbBn, 18)
}

export const formatUsd = (usd: number) => {
  return `$${usd.toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 })}`
}

export const formatBnb = (bnb: number) => {
  return bnb ? bnb.toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 }) : bnb
}

export const formatBnbFromBigNumber = (bnbBn: BigNumber) => {
  return formatBnb(getBnbAmount(bnbBn).toNumber())
}

export const formatRoundPriceDifference = (lockPrice: Round['lockPrice'], closePrice: Round['closePrice']) => {
  return formatUsd(closePrice - lockPrice)
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

// TODO: Move this to the UI Kit
export const getBubbleGumBackground = (theme: DefaultTheme) => {
  if (theme.isDark) {
    return 'linear-gradient(139.73deg, #142339 0%, #24243D 47.4%, #37273F 100%)'
  }

  return 'linear-gradient(139.73deg, #E6FDFF 0%, #EFF4F5 46.87%, #F3EFFF 100%)'
}
