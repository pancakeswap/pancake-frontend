import { useQuery } from '@tanstack/react-query'
import { GAMIFICATION_PUBLIC_API } from 'config/constants/endpoints'

interface AllUserIdsByQuestId {
  questId: string
  users: Array<string>
}

const initialData: AllUserIdsByQuestId = {
  questId: '',
  users: [],
}

export const useGetAllUserIdsByQuestId = (questId: string) => {
  const { data, refetch, isFetching } = useQuery({
    queryKey: ['get-all-user-ids-by-quest', questId],
    queryFn: async () => {
      try {
        const response = await fetch(`${GAMIFICATION_PUBLIC_API}/questInfo/v1/getAllUserIdsByQuestId/${questId}`)
        const result = await response.json()
        const allUserIdsByQuestId: AllUserIdsByQuestId = result
        return allUserIdsByQuestId
      } catch (error) {
        console.error(`Fetch all user ids by quest error: ${error}`)
        return initialData
      }
    },
    enabled: Boolean(questId),
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  })

  return {
    allUserIdsByQuestId: data ?? initialData,
    isFetching,
    refresh: refetch,
  }
}
