import { useQuery } from '@tanstack/react-query'
// import { GAMIFICATION_PUBLIC_API } from 'config/constants/endpoints'

interface AllUserIdsByQuestId {
  totalAmount: 0
}

const initialData: AllUserIdsByQuestId = {
  totalAmount: 0,
}

export const useGetAllUserIdsByQuestId = (questId: string) => {
  const { data, refetch, isFetching } = useQuery({
    queryKey: [questId, 'get-all-user-ids-by-quest'],
    queryFn: async () => {
      try {
        // const response = await fetch(`${GAMIFICATION_PUBLIC_API}/userInfo/v1/getAllUserIdsByQuestId/${questId}`)
        // const result = await response.json()
        // const userSocialHubData: VerifyTaskStatus = result
        // return userSocialHubData
        return initialData
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
