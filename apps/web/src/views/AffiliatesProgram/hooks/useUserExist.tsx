import useSWR from 'swr'
import { useAccount } from 'wagmi'
import qs from 'qs'

interface UserExistResponse {
  exist: boolean
}

const useUserExist = () => {
  const { address } = useAccount()

  const { data: isUserExist } = useSWR(
    address && ['/user-exist', address],
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
      revalidateOnFocus: false,
      revalidateIfStale: false,
      revalidateOnReconnect: false,
      revalidateOnMount: true,
    },
  )

  return {
    isUserExist: isUserExist ?? true,
  }
}

export default useUserExist
