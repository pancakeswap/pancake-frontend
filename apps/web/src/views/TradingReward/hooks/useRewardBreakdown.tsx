import useSWR from 'swr'
import { ChainId } from '@pancakeswap/sdk'
import BigNumber from 'bignumber.js'
import { getTradingRewardContract } from 'utils/contractHelpers'
import { TRADING_REWARD_API } from 'config/constants/endpoints'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { farmsV3ConfigChainMap } from '@pancakeswap/farms/constants/v3'
import { CampaignIdInfoResponse } from 'views/TradingReward/hooks/useCampaignIdInfo'
import { UserCampaignInfoDetail } from 'views/TradingReward/hooks/useAllUserCampaignInfo'
import { AllTradingRewardPairDetail } from 'views/TradingReward/hooks/useAllTradingRewardPair'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'

interface UseRewardBreakdownProps {
  allUserCampaignInfo: UserCampaignInfoDetail[]
  allTradingRewardPairData: AllTradingRewardPairDetail
}

export interface RewardBreakdownPair {
  address: string
  lpSymbol: string
  token: string
  quoteToken: string
  yourVolume: number
  totalVolume: number
  totalReward: number
  rewardEarned: number
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
}: UseRewardBreakdownProps): RewardBreakdown => {
  const { chainId } = useActiveChainId()
  const farms = farmsV3ConfigChainMap[chainId as ChainId]
  const tradingRewardContract = getTradingRewardContract(chainId)
  const currentDate = new Date().getTime() / 1000

  const { data: rewardBreakdownList, isLoading } = useSWR(
    ['/rewards-breakdown', allUserCampaignInfo, allTradingRewardPairData],
    async () => {
      try {
        const dataInfo = await Promise.all(
          allUserCampaignInfo.map(async (user) => {
            const response = await fetch(
              `${TRADING_REWARD_API}/campaign/chainId/${chainId}/campaignId/${user.campaignId}/address/0x`,
            )
            const { data: result }: { data: CampaignIdInfoResponse } = await response.json()
            const campaignIncentive = allTradingRewardPairData?.campaignIdsIncentive?.find(
              (i) => i.campaignId === user.campaignId,
            )

            const pairs = await Promise.all(
              user.volumeArr.map(async (volume) => {
                const pairInfo = farms.find((farm) => farm.lpAddress.toLowerCase() === volume.pool.toLowerCase())
                const pair = result.volumeArr.find((arr) => arr.pool.toLowerCase() === volume.pool.toLowerCase())
                const canClaimResponse = await tradingRewardContract.canClaim(
                  user.campaignId,
                  new BigNumber(volume.volume.toFixed(2)).times(1e18).toString(),
                )
                const rewardEarned =
                  campaignIncentive?.campaignClaimTime - currentDate > 0
                    ? volume.estimateReward
                    : getBalanceNumber(new BigNumber(canClaimResponse.toString()))

                return {
                  address: volume.pool,
                  lpSymbol: pairInfo?.lpSymbol ?? '',
                  token: pairInfo?.token?.address ?? '',
                  quoteToken: pairInfo?.quoteToken?.address ?? '',
                  yourVolume: volume.volume,
                  totalVolume: pair.volume,
                  totalReward: pair.estimateReward,
                  rewardEarned,
                }
              }),
            )

            return {
              campaignId: user.campaignId,
              campaignStart: campaignIncentive?.campaignStart ?? 0,
              campaignClaimTime: campaignIncentive?.campaignClaimTime ?? 0,
              pairs,
            }
          }),
        )

        return dataInfo
      } catch (error) {
        console.info(`Fetch Reward Breakdown Error: ${error}`)
        return []
      }
    },
    {
      fallbackData: [],
    },
  )

  return {
    isFetching: isLoading,
    data: rewardBreakdownList,
  }
}

export default useRewardBreakdown
