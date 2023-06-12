import useSWR from 'swr'
import { useAccount } from 'wagmi'
import qs from 'qs'

interface UserInfoResponse {
  user: {
    address: string
    availableFeeUSD: string
  }
}

const useUserInfo = () => {
  const { address } = useAccount()

  const { data: userInfo } = useSWR(address && ['/user-ifo', address], async () => {
    try {
      const queryString = qs.stringify({ address })
      const response = await fetch(`/api/affiliates-program/user-info?${queryString}`)
      const result: UserInfoResponse = await response.json()
      return {
        availableFeeUSD: result?.user?.availableFeeUSD || '0',
      }
    } catch (error) {
      console.error(`Fetch User Info Error: ${error}`)
      return {
        availableFeeUSD: '0',
      }
    }
  })

  return {
    userInfo: userInfo ?? {
      availableFeeUSD: '0',
    },
  }
}

export default useUserInfo
