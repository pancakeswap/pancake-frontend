import useSWR from 'swr'
import BigNumber from 'bignumber.js'
import { useAccount } from 'wagmi'
import { FAST_INTERVAL } from 'config/constants'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { TRADING_REWARD_API } from 'config/constants/endpoints'
import { getTradingRewardContract } from 'utils/contractHelpers'
import { CampaignIdInfoResponse, CampaignIdInfoDetail, initialState } from './useCampaignIdInfo'

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
  currentCanClaim: string
}

export interface AllUserCampaignInfo {
  isFetching: boolean
  data: UserCampaignInfoDetail[]
}

const useUserAllCampaignInfo = (campaignIds: Array<string>): AllUserCampaignInfo => {
  const { chainId } = useActiveChainId()
  const { address: account } = useAccount()
  const tradingRewardContract = getTradingRewardContract(chainId)

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

            const totalVolume = userCampaignInfo.volumeArr
              .map((i) => i.volume)
              .reduce((a, b) => new BigNumber(a).plus(b).toNumber(), 0)

            // Get user current trading reward
            const currentCanClaim = await tradingRewardContract.canClaim(campaignId, totalVolume)

            const newData = {
              ...userCampaignInfo,
              ...userInfoQualification,
              campaignId,
              totalVolume,
              currentCanClaim: new BigNumber(currentCanClaim.toString()).toJSON(),
            }
            return newData
          }),
        )

        return allUserCampaignInfo
      } catch (error) {
        console.info(`Fetch All User Campaign Info Error: ${error}`)
        return []
      }
    },
    { refreshInterval: FAST_INTERVAL },
  )

  return {
    isFetching: isLoading,
    data: allUserCampaignInfoData ?? [],
  }
}

export default useUserAllCampaignInfo
