import BigNumber from 'bignumber.js'
import { getBalanceAmount } from '@pancakeswap/utils/formatBalance'

interface UseRewardInUSDProps {
  timeRemaining: number
  totalEstimateRewardUSD: number
  canClaim: string
  rewardPrice: string
  rewardTokenDecimal: number
}

const useRewardInUSD = ({
  timeRemaining,
  totalEstimateRewardUSD,
  canClaim,
  rewardPrice,
  rewardTokenDecimal = 18,
}: UseRewardInUSDProps) => {
  const rewardPriceAsBg = new BigNumber(rewardPrice).div(rewardTokenDecimal)
  return timeRemaining > 0
    ? totalEstimateRewardUSD || 0
    : new BigNumber(getBalanceAmount(new BigNumber(canClaim.toString())).times(rewardPriceAsBg)).toNumber() || 0
}

export default useRewardInUSD
