import { useQuery } from '@tanstack/react-query'
import { GAMIFICATION_PUBLIC_API } from 'config/constants/endpoints'
import { useAuthJwtToken } from 'hooks/useAuthJwtToken'

interface AllUserIdsByQuestId {
  questId: string
  users: Array<string>
}

const initialData: AllUserIdsByQuestId = {
  questId: '',
  users: [],
}

export const useGetAllUserIdsByQuestId = (questId: string) => {
  const { token } = useAuthJwtToken()

  const { data, refetch, isFetching } = useQuery({
    queryKey: ['get-all-user-ids-by-quest', questId],
    queryFn: async () => {
      try {
        const response = await fetch(`${GAMIFICATION_PUBLIC_API}/userInfo/v1/getAllUserIdsByQuestId/${questId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })
        const result = await response.json()
        const allUserIdsByQuestId: AllUserIdsByQuestId = result
        return allUserIdsByQuestId
      } catch (error) {
        console.error(`Fetch all user ids by quest error: ${error}`)
        return initialData
      }
    },
    enabled: Boolean(questId && token),
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
