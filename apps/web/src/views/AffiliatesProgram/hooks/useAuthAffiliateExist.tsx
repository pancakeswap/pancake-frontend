import useSWR from 'swr'
import { useAccount } from 'wagmi'
import qs from 'qs'

const useAuthAffiliateExist = () => {
  const { address } = useAccount()

  const { data: isAffiliateExist } = useSWR(
    address && ['/affiliate-exist', address],
    async () => {
      try {
        const queryString = qs.stringify({ address })
        const response = await fetch(`/api/affiliates-program/affiliate-exist?${queryString}`)
        const result = await response.json()
        return result.exist as boolean
      } catch (error) {
        console.error(`Fetch Affiliate Exist Error: ${error}`)
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
    isAffiliateExist,
  }
}

export default useAuthAffiliateExist
