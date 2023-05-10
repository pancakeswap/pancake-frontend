import useSWR from 'swr'
import BigNumber from 'bignumber.js'
import { useAccount } from 'wagmi'
import { SLOW_INTERVAL } from 'config/constants'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { TRADING_REWARD_API } from 'config/constants/endpoints'
import tradingRewardABI from 'config/abi/tradingReward.json'
import { getTradingRewardAddress } from 'utils/addressHelpers'
import { multicallv2 } from 'utils/multicall'
import { CampaignIdInfoResponse, CampaignIdInfoDetail } from 'views/TradingReward/hooks/useCampaignIdInfo'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'

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

const useAllUserCampaignInfo = (campaignIds: Array<string>): AllUserCampaignInfo => {
  const { chainId } = useActiveChainId()
  const { address: account } = useAccount()
  const tradingRewardAddress = getTradingRewardAddress(chainId)

  const { data: allUserCampaignInfoData, isLoading } = useSWR(
    campaignIds.length > 0 && chainId && account && ['/all-campaign-id-info', account, chainId, campaignIds],
    async () => {
      try {
        const allUserCampaignInfo = await Promise.all(
          campaignIds.map(async (campaignId: string) => {
            const [userCampaignInfoResponse, userInfoQualificationResponse] = await Promise.all([
              fetch(`${TRADING_REWARD_API}/campaign/chainId/${chainId}/campaignId/${campaignId}/address/${account}`),
              fetch(`${TRADING_REWARD_API}/user/chainId/${chainId}/campaignId/${campaignId}/address/${account}`),
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

            const totalEstimateRewardUSD = userCampaignInfo.tradingFeeArr
              .map((i) => i.estimateRewardUSD)
              .reduce((a, b) => new BigNumber(a).plus(b).toNumber(), 0)

            const calls = [
              {
                name: 'canClaim',
                address: tradingRewardAddress,
                params: [campaignId, account, new BigNumber(totalVolume.toFixed(2)).times(1e18).toString()],
              },
              {
                name: 'userClaimedIncentives',
                address: tradingRewardAddress,
                params: [campaignId, account],
              },
            ]

            const [canClaim, [userClaimedIncentives]] = await multicallv2({
              abi: tradingRewardABI,
              calls,
              chainId,
              options: { requireSuccess: false },
            })

            return {
              ...userCampaignInfo,
              ...userInfoQualification,
              campaignId,
              totalVolume,
              totalEstimateRewardUSD,
              canClaim: getBalanceNumber(new BigNumber(canClaim.toString())).toString(),
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
