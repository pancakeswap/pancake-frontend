import { useQuery } from '@tanstack/react-query'
import { useAccount } from 'wagmi'
import qs from 'qs'

interface UserExistResponse {
  exist: boolean
}

const useUserExist = () => {
  const { address } = useAccount()

  const { data: isUserExist, isLoading } = useQuery(
    ['affiliates-program', 'user-exist', address],
    async () => {
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
    {
      enabled: !!address,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    },
  )

  return {
    isUserExist: isUserExist ?? true,
    isFetching: isLoading,
  }
}

export default useUserExist
