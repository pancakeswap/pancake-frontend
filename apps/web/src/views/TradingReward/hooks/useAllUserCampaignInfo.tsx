import useSWR from 'swr'
import BigNumber from 'bignumber.js'
import { useAccount } from 'wagmi'
import { SLOW_INTERVAL } from 'config/constants'
import { TRADING_REWARD_API } from 'config/constants/endpoints'
import { tradingRewardABI } from 'config/abi/tradingReward'
import { getTradingRewardAddress, getTradingRewardTopTradesAddress } from 'utils/addressHelpers'
import { CampaignIdInfoResponse, CampaignIdInfoDetail } from 'views/TradingReward/hooks/useCampaignIdInfo'
import { ChainId } from '@pancakeswap/sdk'
import { publicClient } from 'utils/wagmi'
import { Address } from 'viem'
import { RewardType } from 'views/TradingReward/hooks/useAllTradingRewardPair'

interface UserCampaignInfoResponse {
  id: string
  isActive: boolean
  lockEndTime: number
  lockStartTime: number
  lockedAmount: number
  createdAt: string
  isQualified: boolean
  thresholdLockedPeriod: number
  thresholdLockedAmount: string
  needsProfileActivated: boolean
}

export interface UserCampaignInfoDetail extends UserCampaignInfoResponse, CampaignIdInfoDetail {
  campaignId: string
  canClaim: string
  userClaimedIncentives: boolean
  campaignClaimTime?: number
  campaignClaimEndTime?: number
}

export interface AllUserCampaignInfo {
  isFetching: boolean
  data: UserCampaignInfoDetail[]
}

interface UseAllUserCampaignInfoProps {
  campaignIds: Array<string>
  type: RewardType
}

const useAllUserCampaignInfo = ({ campaignIds, type }: UseAllUserCampaignInfoProps): AllUserCampaignInfo => {
  const { address: account } = useAccount()
  const tradingRewardAddress =
    type === RewardType.CAKE_STAKERS
      ? getTradingRewardAddress(ChainId.BSC)
      : getTradingRewardTopTradesAddress(ChainId.BSC)

  const { data: allUserCampaignInfoData, isLoading } = useSWR(
    campaignIds.length > 0 && account && type && ['/all-campaign-id-info', account, campaignIds, type],
    async () => {
      try {
        const allUserCampaignInfo = await Promise.all(
          campaignIds.map(async (campaignId: string) => {
            const [userCampaignInfoResponse, userInfoQualificationResponse] = await Promise.all([
              fetch(`${TRADING_REWARD_API}/campaign/campaignId/${campaignId}/address/${account}/type/${type}`),
              fetch(`${TRADING_REWARD_API}/user/campaignId/${campaignId}/address/${account}/type/${type}`),
            ])

            const [userCampaignInfoResult, userInfoQualificationResult] = await Promise.all([
              userCampaignInfoResponse.json(),
              userInfoQualificationResponse.json(),
            ])

            const userCampaignInfo: CampaignIdInfoResponse = userCampaignInfoResult.data
            const userInfoQualification: UserCampaignInfoResponse = userInfoQualificationResult.data

            const totalVolume = userCampaignInfo.tradingFeeArr
              .map((i) => i.volume)
              .reduce((a, b) => new BigNumber(a).plus(b).toNumber(), 0)

            const totalTradingFee = userCampaignInfo.tradingFeeArr
              .map((i) => i.tradingFee)
              .reduce((a, b) => new BigNumber(a).plus(b).toNumber(), 0)

            const totalEstimateRewardUSD = userCampaignInfo.tradingFeeArr
              .map((i) => i.estimateRewardUSD)
              .reduce((a, b) => new BigNumber(a).plus(b).toNumber(), 0)

            const canClaimDataCalls = userCampaignInfo.tradingFeeArr
              .filter((a) => new BigNumber(a.tradingFee).gt(0))
              .map(
                (i) =>
                  ({
                    abi: tradingRewardABI,
                    functionName: 'canClaim',
                    address: tradingRewardAddress as Address,
                    args: [
                      campaignId,
                      account,
                      BigInt(new BigNumber(Number(i.tradingFee).toFixed(8)).times(1e18).toString()),
                    ] as const,
                  } as const),
              )

            const bscClient = publicClient({ chainId: ChainId.BSC })

            const userClaimedIncentives = await bscClient.readContract({
              abi: tradingRewardABI,
              address: tradingRewardAddress,
              functionName: 'userClaimedIncentives',
              args: [campaignId, account],
            })

            const canClaimResult = await bscClient.multicall({
              contracts: canClaimDataCalls,
            })

            const totalCanClaimData = canClaimResult
              ? canClaimResult
                  .map((canClaim) => (canClaim.result ? canClaim.result : 0n))
                  .reduce((a, b) => a + b, 0n)
                  .toString() ?? '0'
              : '0'

            return {
              ...userCampaignInfo,
              ...userInfoQualification,
              campaignId,
              totalVolume,
              totalEstimateRewardUSD,
              totalTradingFee,
              canClaim: totalCanClaimData,
              userClaimedIncentives,
            }
          }),
        )

        return allUserCampaignInfo
      } catch (error) {
        console.info(`Fetch All User Campaign Info Error: ${error}`)
        return []
      }
    },
    {
      refreshInterval: SLOW_INTERVAL,
      fallbackData: [],
    },
  )

  return {
    isFetching: isLoading,
    data: allUserCampaignInfoData,
  }
}

export default useAllUserCampaignInfo
