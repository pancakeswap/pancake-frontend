import useSWR from 'swr'
import { useAccount } from 'wagmi'
import qs from 'qs'
import useAuthAffiliateExist from 'views/AffiliatesProgram/hooks/useAuthAffiliateExist'
import { UserClaimListResponse, MAX_PER_PAGE } from 'views/AffiliatesProgram/hooks/useUserClaimList'

const useAffiliateClaimList = ({ currentPage }) => {
  const { address } = useAccount()
  const { isAffiliateExist } = useAuthAffiliateExist()

  const { data, isLoading } = useSWR(
    address && isAffiliateExist && ['/affiliate-claim-list', isAffiliateExist, address, currentPage],
    async () => {
      try {
        const skip = currentPage === 1 ? 0 : (currentPage - 1) * MAX_PER_PAGE
        const urlParamsObject = { address, skip, take: MAX_PER_PAGE }
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
  )

  return {
    data,
    isFetching: isLoading,
  }
}

export default useAffiliateClaimList
