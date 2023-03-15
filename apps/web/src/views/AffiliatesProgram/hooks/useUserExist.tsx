import useSWR from 'swr'
import { useAccount } from 'wagmi'
import qs from 'qs'

const useUserExist = () => {
  const { address } = useAccount()

  const { data: isUserExist } = useSWR(
    address && ['/user-exist', address],
    async () => {
      try {
        const queryString = qs.stringify({ address })
        const response = await fetch(`/api/affiliates-program/user-exist?${queryString}`)
        const result = await response.json()
        return result.exist as boolean
      } catch (error) {
        console.error(`Fetch User Exist Error: ${error}`)
        return false
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
    isUserExist,
  }
}

export default useUserExist
