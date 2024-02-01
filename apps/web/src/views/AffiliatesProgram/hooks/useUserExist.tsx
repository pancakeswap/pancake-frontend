import { useQuery } from '@tanstack/react-query'
import qs from 'qs'
import { useAccount } from 'wagmi'

interface UserExistResponse {
  exist: boolean
}

const useUserExist = () => {
  const { address } = useAccount()

  const { data: isUserExist, isPending } = useQuery({
    queryKey: ['affiliates-program', 'user-exist', address],

    queryFn: async () => {
      try {
        const queryString = qs.stringify({ address })
        const response = await fetch(`/api/affiliates-program/user-exist?${queryString}`)
        const result: UserExistResponse = await response.json()
        return result.exist
      } catch (error) {
        console.error(`Fetch User Exist Error: ${error}`)
        return true
      }
    },

    enabled: !!address,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  })

  return {
    isUserExist: isUserExist ?? true,
    isFetching: isPending,
  }
}

export default useUserExist
