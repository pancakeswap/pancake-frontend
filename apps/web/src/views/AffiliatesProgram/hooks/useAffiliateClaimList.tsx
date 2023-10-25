import { useAccount } from 'wagmi'
import qs from 'qs'
import useAuthAffiliate from 'views/AffiliatesProgram/hooks/useAuthAffiliate'
import useAuthAffiliateExist from 'views/AffiliatesProgram/hooks/useAuthAffiliateExist'
import { UserClaimListResponse, MAX_PER_PAGE } from 'views/AffiliatesProgram/hooks/useUserClaimList'
import { FAST_INTERVAL } from 'config/constants'
import { useQuery } from '@tanstack/react-query'

const useAffiliateClaimList = ({ currentPage }) => {
  const { address } = useAccount()
  const { isAffiliate } = useAuthAffiliate()
  const { isAffiliateExist } = useAuthAffiliateExist()

  const { data, isLoading, refetch } = useQuery(
    ['affiliates-program', 'affiliate-claim-list', isAffiliateExist, isAffiliate, address, currentPage],
    async () => {
      try {
        const skip = currentPage === 1 ? 0 : (currentPage - 1) * MAX_PER_PAGE
        const urlParamsObject = { skip, take: MAX_PER_PAGE }
        const queryString = qs.stringify(urlParamsObject)

        const response = await fetch(`/api/affiliates-program/affiliate-claim-list?${queryString}`)
        const result: UserClaimListResponse = await response.json()
        return {
          total: result.total,
          claimRequests: result.claimRequests,
        }
      } catch (error) {
        console.error(`Fetch Affiliate Claim List Error: ${error}`)
        return {
          total: 0,
          claimRequests: [],
        }
      }
    },
    {
      enabled: Boolean(address && isAffiliateExist && isAffiliate),
      refetchInterval: FAST_INTERVAL * 3,
      keepPreviousData: true,
    },
  )

  return {
    data,
    isFetching: isLoading,
    mutate: refetch,
  }
}

export default useAffiliateClaimList
