import useSWR from 'swr'
import { useState } from 'react'
import { TRADING_REWARD_API } from 'config/constants/endpoints'
import { RewardType } from 'views/TradingReward/hooks/useAllTradingRewardPair'

interface UseRankListProps {
  campaignId: string
  currentPage: number
}

export interface RankListDetail {
  origin: string
  tradingFee: number
  volume: number
  rank: number
  estimateRewardUSD: number
}

interface RankListResponse {
  data: {
    total: number
    topTradersArr: RankListDetail[]
  }
}

interface RankList {
  isLoading: boolean
  total: number
  topThreeTraders: RankListDetail[]
  topTradersArr: RankListDetail[]
}

export const MAX_PER_PAGE = 10

const TOP_RANK_NUMBER = 3

export const useRankList = ({ campaignId, currentPage }: UseRankListProps): RankList => {
  const [isLoading, setIsLoading] = useState(false)
  const [lastCampaignId, setLastCampaignId] = useState('')
  const [topThreeTraders, setTopThreeTraders] = useState<RankListDetail[]>([])

  const { data } = useSWR(
    Number(campaignId) > 0 && currentPage && ['/trader-rank-list', campaignId, currentPage],
    async () => {
      try {
        setIsLoading(true)
        setLastCampaignId(campaignId)
        if (campaignId !== lastCampaignId) {
          setTopThreeTraders([])
        }

        const response = await fetch(
          `${TRADING_REWARD_API}/rank_list/campaignId/${campaignId}/type/${RewardType.TOP_TRADERS}/page/${currentPage}/size/${MAX_PER_PAGE}`,
        )
        const result: RankListResponse = await response.json()

        const topThree = result.data.topTradersArr.filter((arr) => arr.rank > 0 && arr.rank <= 3)
        if (topThree.length === TOP_RANK_NUMBER) {
          setTopThreeTraders(topThree)

          return {
            total: result.data.total,
            topTradersArr: result.data.topTradersArr.slice(TOP_RANK_NUMBER, result.data.topTradersArr.length),
          }
        }

        return {
          total: result.data.total,
          topTradersArr: result.data.topTradersArr,
        }
      } catch (error) {
        console.info(`Fetch Rank List Error: ${error}`)
        return {
          total: 0,
          topTradersArr: [],
        }
      } finally {
        setIsLoading(false)
      }
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateOnMount: true,
    },
  )

  return {
    isLoading,
    topThreeTraders,
    total: data?.total ?? 0,
    topTradersArr: data?.topTradersArr ?? [],
  }
}

export default useRankList
