import { ReactText } from 'react'
import { getBalanceNumber } from 'utils/formatBalance'
import prizes from 'config/constants/trading-competition/prizes'
import BigNumber from 'bignumber.js'
import useBUSDPrice, { useCakeBusdPrice } from 'hooks/useBUSDPrice'
import tokens from 'config/constants/tokens'
import { multiplyPriceByAmount } from 'utils/prices'

export const localiseTradingVolume = (value: number, decimals = 0) => {
  return value.toLocaleString('en-US', { maximumFractionDigits: decimals })
}

export const useCompetitionRewards = ({
  userCakeRewards,
  userMoboxRewards,
}: {
  userCakeRewards: ReactText
  userMoboxRewards: ReactText
}) => {
  const moboxPriceBUSD = useBUSDPrice(tokens.mbox)
  const cakeAsBigNumber = new BigNumber(userCakeRewards as string)
  const moboxAsBigNumber = new BigNumber(userMoboxRewards as string)
  const cakeBalance = getBalanceNumber(cakeAsBigNumber)
  const moboxBalance = getBalanceNumber(moboxAsBigNumber, 8)
  const cakePriceBusd = useCakeBusdPrice()

  const dollarValueOfTokensReward =
    cakePriceBusd && moboxPriceBUSD
      ? multiplyPriceByAmount(cakePriceBusd, cakeBalance) + multiplyPriceByAmount(moboxPriceBUSD, moboxBalance, 8)
      : null

  return {
    cakeReward: cakeBalance,
    moboxReward: moboxBalance,
    dollarValueOfTokensReward,
  }
}

// given we have userPointReward and userRewardGroup, we can find the specific reward because no Rank has same two values.
export const getRewardGroupAchievements = (userRewardGroup: string, userPointReward: string) => {
  const prize = Object.values(prizes)
    .flat()
    .find((rank) => rank.achievements.points === Number(userPointReward) && rank.group === userRewardGroup)
  return prize && prize.achievements
}

export default localiseTradingVolume
