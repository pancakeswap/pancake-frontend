import { useAccount } from 'wagmi'
import { RewardType } from 'views/TradingReward/hooks/useAllTradingRewardPair'
import { TRADING_REWARD_API } from 'config/constants/endpoints'
import { useQuery } from '@tanstack/react-query'

const initialState = {
  claimedRebate: false,
  claimedTopTraders: false,
}

const useTradingFeeClaimedRecord = ({ type, campaignId }: { type: RewardType; campaignId: string }) => {
  const { address: account } = useAccount()

  const { data } = useQuery({
    queryKey: ['tradingReward', 'trading-fee-claimed-record', account],

    queryFn: async () => {
      try {
        // campaignId & type will not affect API value
        const response = await fetch(
          `${TRADING_REWARD_API}/campaign/claimedRecord/campaignId/${campaignId}/address/${account}/type/${type}`,
        )
        const result = await response.json()
        return result.data
      } catch (error) {
        console.info(`Fetch Trading Fee Claimed Record Error: ${error}`)
        return initialState
      }
    },

    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    initialData: initialState,
    enabled: Boolean(account && type),
  })

  return data
}

export default useTradingFeeClaimedRecord
