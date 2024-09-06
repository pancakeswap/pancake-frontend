import { ChainId } from '@pancakeswap/chains'
import { useQuery } from '@tanstack/react-query'
import { GAMIFICATION_PUBLIC_DASHBOARD_API } from 'config/constants/endpoints'
import { useDashboardSiwe } from 'hooks/useDashboardSiwe'
import qs from 'qs'
import { useEffect, useRef, useState } from 'react'
import { SingleQuestData } from 'views/DashboardQuestEdit/hooks/useGetSingleQuestData'
import { CompletionStatus } from 'views/DashboardQuestEdit/type'
import { AllDashboardQuestsType } from 'views/DashboardQuests/type'
import { useAccount } from 'wagmi'

export interface UseFetchAllQuestsProps {
  chainIdList: ChainId[]
  completionStatus: CompletionStatus
}

const PAGE_SIZE = 50

const initialData: AllDashboardQuestsType = {
  quests: [],
  pagination: { page: 1, pageSize: PAGE_SIZE, total: 0, dataInPage: 0 },
}

export const useFetchAllQuests = ({ chainIdList, completionStatus }) => {
  const { address: account, chainId } = useAccount()
  const { fetchWithSiweAuth } = useDashboardSiwe()
  const [page, setPage] = useState(1)
  const [quests, setQuests] = useState<SingleQuestData[]>([])
  const [hasNextPage, setHasNextPage] = useState<boolean>(true)
  const [prevData, setPrevData] = useState<string>('')
  const isFetchingRef = useRef(false)

  const { refetch, isFetching } = useQuery({
    queryKey: ['fetch-all-quest-dashboard-data', page, account, chainId, chainIdList, completionStatus],
    queryFn: async () => {
      if (!account || !chainId) {
        throw new Error('Invalid account')
      }
      try {
        const prevDataSting = `${account}-${page}-${chainIdList}-${completionStatus}`
        if (prevData === prevDataSting) {
          return undefined
        }
        setPrevData(prevDataSting)

        if (chainIdList.length === 0) {
          return initialData
        }

        const urlParamsObject = {
          chainId: chainIdList.join(','),
          completionStatus,
          page,
          pageSize: PAGE_SIZE,
        }
        const queryString = qs.stringify(urlParamsObject, { arrayFormat: 'comma' })
        const response = await fetchWithSiweAuth(
          `${GAMIFICATION_PUBLIC_DASHBOARD_API}/quests/org/${account?.toLowerCase()}?${queryString}`,
        )

        const result = await response.json()
        const questsData: AllDashboardQuestsType = result

        setQuests((prev) => (page === 1 ? questsData.quests : [...prev, ...questsData.quests]))
        setHasNextPage(questsData.pagination.page * PAGE_SIZE < questsData.pagination.total)

        return questsData
      } catch (error) {
        console.error(`Fetch All quest dashboard data error: ${error}`)
        return initialData
      }
    },
    enabled: Boolean(account && completionStatus),
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
    page,
  }
}
