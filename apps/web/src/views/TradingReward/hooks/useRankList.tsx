import useSWR from 'swr'
import { useState } from 'react'
import { TRADING_REWARD_API } from 'config/constants/endpoints'

interface UseRankListProps {
  campaignId: string
  currentPage: number
}

export interface RankListDetail {
  id?: number
  origin: string
  tradingFee: number
  volume: number
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
  topTradersArr: RankListDetail[]
}

export const MAX_PER_PAGE = 10

export const useRankList = ({ campaignId, currentPage }: UseRankListProps): RankList => {
  const [total, setTotal] = useState(0)
  const [topTradersArr, setTopTradersArr] = useState<RankListDetail[]>([])

  const { isLoading } = useSWR(
    campaignId && currentPage && ['/trader-rank-list', campaignId, currentPage],
    async () => {
      try {
        const response = await fetch(`${TRADING_REWARD_API}/rank_list/campaignId/20230601/type/tt`)
        const result: RankListResponse = await response.json()
        setTotal(result.data.total)

        const newData = result.data.topTradersArr.map((arr, index) => ({
          ...arr,
          id: index + 1,
        }))
        setTopTradersArr(newData)
      } catch (error) {
        console.info(`Fetch Rank List Error: ${error}`)
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
    total,
    topTradersArr,
    isLoading,
  }
}

export default useRankList
