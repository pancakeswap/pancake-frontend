import useSWR from 'swr'
import { useAccount } from 'wagmi'
import qs from 'qs'

interface AuthAffiliateExistResponse {
  exist: boolean
}

const useAuthAffiliateExist = () => {
  const { address } = useAccount()

  const { data: isAffiliateExist } = useSWR(
    address && ['/affiliate-exist', address],
    async () => {
      try {
        const queryString = qs.stringify({ address })
        const response = await fetch(`/api/affiliates-program/affiliate-exist?${queryString}`)
        const result: AuthAffiliateExistResponse = await response.json()
        return result.exist
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
    isAffiliateExist: (isAffiliateExist && !!address) ?? null,
  }
}

export default useAuthAffiliateExist
