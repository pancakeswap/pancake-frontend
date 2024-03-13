import { ChainId } from '@pancakeswap/chains'
import { Token } from '@pancakeswap/swap-sdk-core'
import { useQuery } from '@tanstack/react-query'
import { tradingRewardPairConfigChainMap } from 'views/TradingReward/config/pairs'
import { AllTradingRewardPairDetail } from 'views/TradingReward/hooks/useAllTradingRewardPair'
import { UserCampaignInfoDetail } from 'views/TradingReward/hooks/useAllUserCampaignInfo'
import { useAccount } from 'wagmi'

interface UseRewardBreakdownProps {
  allUserCampaignInfo: UserCampaignInfoDetail[]
  allTradingRewardPairData: AllTradingRewardPairDetail
  campaignPairs: { [campaignId in string]: { [chainId in string]: Array<string> } }
}

export interface RewardBreakdownPair {
  chainId: ChainId
  address: string
  lpSymbol: string
  token: Token
  quoteToken: Token
  yourVolume: number
  rewardEarned: number
  yourTradingFee: string
  feeAmount: number
  preCap: number
}

export interface RewardBreakdownDetail {
  campaignId: string
  campaignStart: number
  campaignClaimTime: number
  pairs: RewardBreakdownPair[]
}

export interface RewardBreakdown {
  isFetching: boolean
  data: RewardBreakdownDetail[]
}

const useRewardBreakdown = ({
  allUserCampaignInfo,
  allTradingRewardPairData,
  campaignPairs,
}: UseRewardBreakdownProps): RewardBreakdown => {
  const { address: account } = useAccount()

  const { data: rewardBreakdownList, isPending } = useQuery({
    queryKey: ['tradingReward', 'rewards-breakdown', allUserCampaignInfo, allTradingRewardPairData, account],

    queryFn: async () => {
      try {
        const dataInfo = Object.keys(campaignPairs).map((campaignId) => {
          const incentive = allTradingRewardPairData.campaignIdsIncentive.find(
            (i) => i.campaignId!.toLowerCase() === campaignId.toLowerCase(),
          )

          const pairs = Object.keys(campaignPairs?.[campaignId]).map((campaignChainId) => {
            // @ts-ignore
            const farms = tradingRewardPairConfigChainMap?.[campaignChainId as ChainId]

            const data = campaignPairs?.[campaignId]?.[campaignChainId].map((lpAddress) => {
              const pairInfo = farms.find((farm) => farm.lpAddress.toLowerCase() === lpAddress.toLowerCase())
              const userData = allUserCampaignInfo
                .find((user) => user.campaignId.toLowerCase() === campaignId.toLowerCase())
                ?.tradingFeeArr.find((i) => i.pool.toLowerCase() === lpAddress.toLowerCase())

              return {
                chainId: Number(campaignChainId) as ChainId,
                address: lpAddress,
                lpSymbol: pairInfo?.lpSymbol ?? '',
                token: pairInfo?.token,
                quoteToken: pairInfo?.quoteToken,
                yourVolume: userData?.volume ?? 0,
                rewardEarned: userData?.estimateRewardUSD ?? 0,
                yourTradingFee: userData?.tradingFee ?? '0',
                feeAmount: pairInfo?.feeAmount ?? 0,
                preCap: userData?.preCap ?? 0,
              }
            })

            return data
          })

          return {
            campaignId,
            campaignStart: incentive?.campaignStart ?? 0,
            campaignClaimTime: incentive?.campaignClaimTime ?? 0,
            pairs: pairs
              .reduce((a, b) => a.concat(b), [])
              .sort((a, b) => Number(b.yourTradingFee) - Number(a.yourTradingFee)),
          }
        })

        return dataInfo
      } catch (error) {
        console.info(`Fetch Reward Breakdown Error: ${error}`)
        return []
      }
    },

    initialData: [],
    enabled: Boolean(account),
  })

  return {
    isFetching: isPending,
    data: rewardBreakdownList,
  }
}

export default useRewardBreakdown
