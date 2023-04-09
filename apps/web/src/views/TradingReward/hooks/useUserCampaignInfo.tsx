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

export interface UserCampaignInfo {
  isFetching: boolean
  data: UserCampaignInfoDetail
}

const initialUserState = {
  ...initialState,
  id: '0',
  isActive: false,
  lockEndTime: 0,
  lockStartTime: 0,
  lockedAmount: 0,
  createdAt: '0',
  isQualified: false,
  thresholdLockedPeriod: 0,
  thresholdLockedAmount: '0',
  needsProfileActivated: false,
  currentCanClaim: '0',
}

const useUserCampaignInfo = (campaignId: string): UserCampaignInfo => {
  const { chainId } = useActiveChainId()
  const { address: account } = useAccount()
  const tradingRewardContract = getTradingRewardContract(chainId)

  const { data: userCampaignInfoData, isLoading } = useSWR(
    campaignId !== '' && chainId && account && ['/campaign-id-info', account, chainId, campaignId],
    async () => {
      try {
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
          totalVolume,
          currentCanClaim: new BigNumber(currentCanClaim.toString()).toJSON(),
        }
        return newData
      } catch (error) {
        console.info(`Fetch User Campaign Info Error: ${error}`)
        return initialUserState
      }
    },
    { refreshInterval: FAST_INTERVAL },
  )

  return {
    isFetching: isLoading,
    data: userCampaignInfoData ?? initialUserState,
  }
}

export default useUserCampaignInfo
