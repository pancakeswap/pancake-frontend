import { useAccount } from 'wagmi'
import qs from 'qs'
import { useQuery } from '@tanstack/react-query'

interface AuthAffiliateExistResponse {
  exist: boolean
}

const useAuthAffiliateExist = () => {
  const { address } = useAccount()

  const { data: isAffiliateExist } = useQuery(
    ['affiliates-program', 'affiliate-exist', address],
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
      enabled: !!address,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  )

  return {
    isAffiliateExist: (isAffiliateExist && !!address) ?? null,
  }
}

export default useAuthAffiliateExist
