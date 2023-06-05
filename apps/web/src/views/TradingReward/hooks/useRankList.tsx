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
  const [isLoading, setIsLoading] = useState(false)
  const [topTradersArr, setTopTradersArr] = useState<RankListDetail[]>([])

  useSWR(
    campaignId && currentPage && ['/trader-rank-list', campaignId, currentPage],
    async () => {
      try {
        if (currentPage * MAX_PER_PAGE > topTradersArr.length) {
          setIsLoading(true)
          const response = await fetch(
            `${TRADING_REWARD_API}/rank_list/campaignId/${campaignId}/type/tt/page/${currentPage}/size/${MAX_PER_PAGE}`,
          )
          const result: RankListResponse = await response.json()
          setTotal(result.data.total)

          const newData = result.data.topTradersArr.map((arr, index) => ({
            ...arr,
            id: topTradersArr.length + index + 1,
          }))
          setTopTradersArr([...topTradersArr, ...newData])
        }
      } catch (error) {
        console.info(`Fetch Rank List Error: ${error}`)
      } finally {
        setIsLoading(false)
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
