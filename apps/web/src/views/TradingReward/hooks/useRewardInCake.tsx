import BigNumber from 'bignumber.js'
import { getBalanceAmount } from '@pancakeswap/utils/formatBalance'

interface UseRewardInCakeProps {
  timeRemaining: number
  totalEstimateRewardUSD: number
  totalReward: string
  cakePrice: BigNumber
  rewardPrice: string
  rewardTokenDecimal: number
}

const useRewardInCake = ({
  timeRemaining,
  totalEstimateRewardUSD,
  totalReward,
  cakePrice,
  rewardPrice,
  rewardTokenDecimal = 18,
}: UseRewardInCakeProps) => {
  const estimateRewardUSD = new BigNumber(totalEstimateRewardUSD)
  const reward = getBalanceAmount(new BigNumber(totalReward))
  const rewardCakePrice = getBalanceAmount(new BigNumber(rewardPrice ?? '0'), rewardTokenDecimal ?? 0)
  const totalCakeReward = reward.div(rewardCakePrice).isNaN() ? 0 : reward.div(rewardCakePrice).toNumber()

  return timeRemaining > 0 ? estimateRewardUSD.div(cakePrice).toNumber() : totalCakeReward
}

export default useRewardInCake
