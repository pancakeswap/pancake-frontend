import useSWR from 'swr'
import { useAccount } from 'wagmi'
import { getCookie, deleteCookie } from 'cookies-next'
import { AFFILIATE_SID } from 'pages/api/affiliates-program/affiliate-login'

const useAuthAffiliate = () => {
  const { address } = useAccount()
  const cookie = getCookie(AFFILIATE_SID)

  const { data: isAffiliate } = useSWR(address && cookie !== '' && ['/auth-affiliate', address, cookie], async () => {
    try {
      const response = await fetch(`/api/affiliates-program/affiliate-info`)
      const result = await response.json()
      if (result.status === 'error') {
        deleteCookie(AFFILIATE_SID)
      }

      return result.status === 'success'
    } catch (error) {
      console.error(`Fetch Affiliate Exist Error: ${error}`)
      return false
    }
  })

  return {
    isAffiliate,
  }
}

export default useAuthAffiliate
