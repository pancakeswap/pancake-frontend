import { ReactText } from 'react'
import { usePriceCakeBusd } from 'state/hooks'
import { getBalanceNumber } from 'utils/formatBalance'
import BigNumber from 'bignumber.js'

export const localiseTradingVolume = (value: number, decimals = 0) => {
  return value.toLocaleString('en-US', { maximumFractionDigits: decimals })
}

export const accountEllipsis = (account: string) =>
  `${account.substring(0, 4)}...${account.substring(account.length - 4)}`

export const UseCompetitionCakeRewards = (userCakeReward: ReactText) => {
  const cakeAsBigNumber = new BigNumber(userCakeReward as string)
  const cakeBalance = getBalanceNumber(cakeAsBigNumber)
  // Would we expect this to return 0 on test net?
  const cakePriceBusd = usePriceCakeBusd()
  return { cakeReward: cakeBalance, dollarValueOfCakeReward: cakeBalance * cakePriceBusd.toNumber() }
}

export default localiseTradingVolume
