import { ChainId } from '@pancakeswap/chains'
import { useQuery } from '@tanstack/react-query'
import { GAMIFICATION_PUBLIC_API } from 'config/constants/endpoints'
import { useEffect, useRef, useState } from 'react'
import { SingleQuestData } from 'views/DashboardQuestEdit/hooks/useGetSingleQuestData'
import { CompletionStatus } from 'views/DashboardQuestEdit/type'
import { AllDashboardQuestsType, Pagination } from 'views/DashboardQuests/type'

export const PAGE_SIZE = 50

export interface FetchAllPublicQuestDataResponse {
  data: SingleQuestData[]
  pagination: Pagination
}

export const initialData: AllDashboardQuestsType = {
  quests: [],
  pagination: { page: 1, pageSize: PAGE_SIZE, total: 0, dataInPage: 0 },
}

interface UsePublicQuestsProps {
  chainIdList: ChainId[]
  completionStatus: CompletionStatus
}

export const usePublicQuests = ({ chainIdList, completionStatus }: UsePublicQuestsProps) => {
  const [page, setPage] = useState(1)
  const [quests, setQuests] = useState<SingleQuestData[]>([])
  const [hasNextPage, setHasNextPage] = useState<boolean>(true)
  const [prevData, setPrevData] = useState<string>('')
  const isFetchingRef = useRef(false)

  const { refetch, isFetching } = useQuery({
    queryKey: ['fetch-all-public-quest-data', page, completionStatus, chainIdList],
    queryFn: async () => {
      try {
        const prevDataSting = `${page}-${chainIdList}-${completionStatus}`
        if (prevData === prevDataSting) {
          return undefined
        }
        setPrevData(prevDataSting)

        if (chainIdList.length === 0) {
          return initialData
        }

        const url = `${GAMIFICATION_PUBLIC_API}/questInfo/v1/questInfoList`
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            page,
            size: PAGE_SIZE,
            chainIdList,
            completionStatus,
          }),
        })
        const result = await response.json()
        const questsData: FetchAllPublicQuestDataResponse = result
        setQuests((prev) => (page === 1 ? questsData.data : [...prev, ...questsData.data]))
        setHasNextPage(questsData.pagination.page < questsData.pagination.total)

        return {
          quests: questsData.data,
          pagination: questsData.pagination,
        }
      } catch (error) {
        console.error(`Fetch all public quests data error: ${error}`)
        return initialData
      }
    },
    enabled: Boolean(completionStatus),
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  })

  useEffect(() => {
    setPage(1)
    setQuests([])
    isFetchingRef.current = true
    refetch().then(() => {
      isFetchingRef.current = false
    })
  }, [completionStatus, chainIdList, refetch])

  const loadMore = () => {
    if (!isFetching && hasNextPage && !isFetchingRef.current) {
      setPage((prevPage) => prevPage + 1)
      isFetchingRef.current = true
      refetch().then(() => {
        isFetchingRef.current = false
      })
    }
  }

  return {
    quests,
    loadMore,
    isFetching,
    hasNextPage,
  }
}
