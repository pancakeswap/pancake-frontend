import { ReactText } from 'react'
import { getBalanceNumber } from 'utils/formatBalance'
import { easterPrizes, PrizesConfig } from 'config/constants/trading-competition/prizes'
import BigNumber from 'bignumber.js'
import useBUSDPrice, { useCakeBusdPrice } from 'hooks/useBUSDPrice'
import tokens from 'config/constants/tokens'
import { multiplyPriceByAmount } from 'utils/prices'

export const localiseTradingVolume = (value: number, decimals = 0) => {
  return value.toLocaleString('en-US', { maximumFractionDigits: decimals })
}

export const useCompetitionCakeRewards = (userCakeReward: ReactText) => {
  const cakeAsBigNumber = new BigNumber(userCakeReward as string)
  const cakeBalance = getBalanceNumber(cakeAsBigNumber)
  const cakePriceBusd = useCakeBusdPrice()
  return {
    cakeReward: cakeBalance,
    dollarValueOfCakeReward: multiplyPriceByAmount(cakePriceBusd, cakeBalance),
  }
}

export const useFanTokenCompetitionRewards = ({
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

export const useMoboxCompetitionRewards = ({
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
  const moboxBalance = getBalanceNumber(moboxAsBigNumber)
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

export const useModCompetitionRewards = ({
  userCakeRewards,
  userDarRewards,
}: {
  userCakeRewards: ReactText
  userDarRewards: ReactText
}) => {
  const darPriceBUSD = useBUSDPrice(tokens.dar)
  const cakeAsBigNumber = new BigNumber(userCakeRewards as string)
  const darAsBigNumber = new BigNumber(userDarRewards as string)
  const cakeBalance = getBalanceNumber(cakeAsBigNumber)
  const darBalance = getBalanceNumber(darAsBigNumber, tokens.dar.decimals)
  const cakePriceBusd = useCakeBusdPrice()

  const dollarValueOfTokensReward =
    cakePriceBusd && darPriceBUSD
      ? multiplyPriceByAmount(cakePriceBusd, cakeBalance) +
        multiplyPriceByAmount(darPriceBUSD, darBalance, tokens.dar.decimals)
      : null

  return {
    cakeReward: cakeBalance,
    darReward: darBalance,
    dollarValueOfTokensReward,
  }
}

// 1 is a reasonable teamRank default: accessing the first team in the config.
// We use the smart contract userPointReward to get a users' points
// Achievement keys are consistent across different teams regardless of team team rank
// If a teamRank value isn't passed, this helper can be used to return achievement keys for a given userRewardGroup
export const getEasterRewardGroupAchievements = (userRewardGroup: string, teamRank = 1) => {
  const userGroup = easterPrizes[teamRank].filter((prizeGroup) => {
    return prizeGroup.group === userRewardGroup
  })[0]
  return userGroup && userGroup.achievements
}

// given we have userPointReward and userRewardGroup, we can find the specific reward because no Rank has same two values.
export const getRewardGroupAchievements = (prizes: PrizesConfig, userRewardGroup: string, userPointReward: string) => {
  const prize = Object.values(prizes)
    .flat()
    .find((rank) => rank.achievements.points === Number(userPointReward) && rank.group === userRewardGroup)
  return prize && prize.achievements
}

export default localiseTradingVolume
