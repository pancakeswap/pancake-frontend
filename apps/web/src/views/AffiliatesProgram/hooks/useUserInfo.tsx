import { useAccount } from 'wagmi'
import qs from 'qs'
import { useQuery } from '@tanstack/react-query'

interface UserInfoResponse {
  user: {
    address: string
    availableFeeUSD: string
  }
}

const useUserInfo = () => {
  const { address } = useAccount()

  const { data: userInfo } = useQuery({
    queryKey: ['affiliates-program', 'user-info', address],

    queryFn: async () => {
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
    },

    enabled: !!address,
  })

  return {
    userInfo: userInfo ?? {
      availableFeeUSD: '0',
    },
  }
}

export default useUserInfo
