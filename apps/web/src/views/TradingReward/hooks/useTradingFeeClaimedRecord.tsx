import useSWR from 'swr'
import { useAccount } from 'wagmi'
import { RewardType } from 'views/TradingReward/hooks/useAllTradingRewardPair'
import { TRADING_REWARD_API } from 'config/constants/endpoints'

const initialState = {
  claimedRebate: false,
  claimedTopTraders: false,
}

const useTradingFeeClaimedRecord = ({ type, campaignId }: { type: RewardType; campaignId: string }) => {
  const { address: account } = useAccount()

  const { data } = useSWR(
    account && type && ['/trading-fee-claimed-record', account],
    async () => {
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
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      revalidateOnReconnect: false,
      revalidateOnMount: true,
      fallbackData: initialState,
    },
  )

  return data
}

export default useTradingFeeClaimedRecord
