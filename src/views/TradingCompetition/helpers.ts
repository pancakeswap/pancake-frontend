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
  userLazioRewards,
  userPortoRewards,
  userSantosRewards,
}: {
  userCakeRewards: ReactText
  userLazioRewards: ReactText
  userPortoRewards: ReactText
  userSantosRewards: ReactText
}) => {
  const lazioPriceBUSD = useBUSDPrice(tokens.lazio)
  const portoPriceBUSD = useBUSDPrice(tokens.porto)
  const santosPriceBUSD = useBUSDPrice(tokens.santos)
  const cakeAsBigNumber = new BigNumber(userCakeRewards as string)
  const lazioAsBigNumber = new BigNumber(userLazioRewards as string)
  const portoAsBigNumber = new BigNumber(userPortoRewards as string)
  const santosAsBigNumber = new BigNumber(userSantosRewards as string)
  const cakeBalance = getBalanceNumber(cakeAsBigNumber)
  const lazioBalance = getBalanceNumber(lazioAsBigNumber, 8)
  const portoBalance = getBalanceNumber(portoAsBigNumber, 8)
  const santosBalance = getBalanceNumber(santosAsBigNumber, 8)
  const cakePriceBusd = useCakeBusdPrice()

  const dollarValueOfTokensReward =
    cakePriceBusd && lazioPriceBUSD && portoPriceBUSD && santosPriceBUSD
      ? multiplyPriceByAmount(cakePriceBusd, cakeBalance) +
        multiplyPriceByAmount(lazioPriceBUSD, lazioBalance, 8) +
        multiplyPriceByAmount(portoPriceBUSD, portoBalance, 8) +
        multiplyPriceByAmount(santosPriceBUSD, santosBalance, 8)
      : null

  return {
    cakeReward: cakeBalance,
    lazioReward: lazioBalance,
    portoReward: portoBalance,
    santosReward: santosBalance,
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
export const getRewardGroupPrize = (userRewardGroup: string, userPointReward: string) => {
  const prize = Object.values(prizes)
    .flat()
    .find((rank) => rank.achievements.points === Number(userPointReward) && rank.group === userRewardGroup)
  return prize && prize
}

export default localiseTradingVolume
