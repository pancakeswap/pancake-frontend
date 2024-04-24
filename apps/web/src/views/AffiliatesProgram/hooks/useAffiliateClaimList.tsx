import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { FAST_INTERVAL } from 'config/constants'
import qs from 'qs'
import useAuthAffiliate from 'views/AffiliatesProgram/hooks/useAuthAffiliate'
import useAuthAffiliateExist from 'views/AffiliatesProgram/hooks/useAuthAffiliateExist'
import { MAX_PER_PAGE, UserClaimListResponse } from 'views/AffiliatesProgram/hooks/useUserClaimList'
import { useAccount } from 'wagmi'

const useAffiliateClaimList = ({ currentPage }) => {
  const { address } = useAccount()
  const { isAffiliate } = useAuthAffiliate()
  const { isAffiliateExist } = useAuthAffiliateExist()

  const { data, isPending, refetch } = useQuery({
    queryKey: ['affiliates-program', 'affiliate-claim-list', isAffiliateExist, isAffiliate, address, currentPage],

    queryFn: async () => {
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

    enabled: Boolean(address && isAffiliateExist !== null && isAffiliate),
    refetchInterval: FAST_INTERVAL * 3,
    placeholderData: keepPreviousData,
  })

  return {
    data,
    isFetching: isPending,
    mutate: refetch,
  }
}

export default useAffiliateClaimList
