import useSWR from 'swr'
import BigNumber from 'bignumber.js'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { TRADING_REWARD_API } from 'config/constants/endpoints'

export interface CampaignVolume {
  pool: string
  volume: number
}

export interface CampaignIdInfoResponse {
  total: number
  volumeArr: CampaignVolume[]
  estimateReward?: number
}

export interface CampaignIdInfoDetail {
  total: number
  totalVolume: number
  volumeArr: CampaignVolume[]
  estimateReward?: number
}

export interface CampaignIdInfo {
  isFetching: boolean
  data: CampaignIdInfoDetail
}

export const initialState: CampaignIdInfoDetail = {
  total: 0,
  totalVolume: 0,
  volumeArr: [],
  estimateReward: 0,
}

const useCampaignIdInfo = (campaignId: string): CampaignIdInfo => {
  const { chainId } = useActiveChainId()

  const { data: campaignIdInfo, isLoading } = useSWR(
    campaignId !== '' && chainId && ['/campaign-id-info', chainId, campaignId],
    async () => {
      try {
        const response = await fetch(
          `${TRADING_REWARD_API}/campaign/chainId/${chainId}/campaignId/${campaignId}/address/0x`,
        )
        const { data }: { data: CampaignIdInfoResponse } = await response.json()
        const totalVolume = data.volumeArr.map((i) => i.volume).reduce((a, b) => new BigNumber(a).plus(b).toNumber(), 0)
        const newData: CampaignIdInfoDetail = {
          ...data,
          totalVolume,
        }
        return newData
      } catch (error) {
        console.info(`Fetch Campaign Id Info Error: ${error}`)
        return initialState
      }
    },
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      revalidateOnReconnect: false,
      revalidateOnMount: true,
    },
  )

  return {
    isFetching: isLoading,
    data: campaignIdInfo ?? initialState,
  }
}

export default useCampaignIdInfo
