import { ChainId } from '@pancakeswap/chains'
import { useQuery } from '@tanstack/react-query'
import BigNumber from 'bignumber.js'
import { TRADING_REWARD_API } from 'config/constants/endpoints'
import { RewardType } from 'views/TradingReward/hooks/useAllTradingRewardPair'

export interface CampaignVolume {
  pool: string
  volume: number
  estimateRewardUSD: number
  tradingFee: string
  maxCap: number
  chainId: ChainId
  preCap: number
}

export interface CampaignIdInfoResponse {
  total: number
  tradingFeeArr: CampaignVolume[]
}

export interface CampaignIdInfoDetail {
  total: number
  totalVolume: number
  tradingFeeArr: CampaignVolume[]
  totalEstimateRewardUSD: number
  totalTradingFee: number
}

export interface CampaignIdInfo {
  isFetching: boolean
  data: CampaignIdInfoDetail
}

export const initialState: CampaignIdInfoDetail = {
  total: 0,
  totalVolume: 0,
  tradingFeeArr: [],
  totalEstimateRewardUSD: 0,
  totalTradingFee: 0,
}

interface UseCampaignIdInfoProps {
  campaignId: string
  type: RewardType
}

const useCampaignIdInfo = ({ campaignId, type }: UseCampaignIdInfoProps): CampaignIdInfo => {
  const { data: campaignIdInfo, isPending } = useQuery({
    queryKey: ['tradingReward', 'campaign-id-info', campaignId, type],

    queryFn: async () => {
      try {
        const response = await fetch(`${TRADING_REWARD_API}/campaign/campaignId/${campaignId}/address/0x/type/${type}`)
        const { data }: { data: CampaignIdInfoResponse } = await response.json()
        const totalVolume = data.tradingFeeArr
          .map((i) => i.volume)
          .reduce((a, b) => new BigNumber(a).plus(b).toNumber(), 0)

        const totalEstimateRewardUSD = data.tradingFeeArr
          .map((i) => i.estimateRewardUSD)
          .reduce((a, b) => new BigNumber(a).plus(b).toNumber(), 0)

        const totalTradingFee = data.tradingFeeArr
          .map((i) => i.tradingFee)
          .reduce((a, b) => new BigNumber(a).plus(b).toNumber(), 0)

        const newData: CampaignIdInfoDetail = {
          ...data,
          totalVolume,
          totalEstimateRewardUSD,
          totalTradingFee,
        }
        return newData
      } catch (error) {
        console.info(`Fetch Campaign Id Info Error: ${error}`)
        return initialState
      }
    },

    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    initialData: initialState,
    enabled: Boolean(campaignId && type),
  })

  return {
    isFetching: isPending,
    data: campaignIdInfo,
  }
}

export default useCampaignIdInfo
