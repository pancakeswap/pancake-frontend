import { useAccount } from '@pancakeswap/awgmi'
import { useQuery } from '@tanstack/react-query'
import { CHECK_USER_IP_API } from 'config/index'

export const useCheckIsUserIpPass = (): boolean => {
  const { account } = useAccount()

  const { data, isPending } = useQuery({
    queryKey: ['checkIsUserIpPass', account],

    queryFn: async () => {
      try {
        const response = await fetch(CHECK_USER_IP_API)
        const responseData = await response.json()
        return responseData.result // true = pass, false = US or vpn
      } catch (error) {
        console.error('Fetch Check User IP Error: ', error)
        return true
      }
    },
    enabled: Boolean(account?.address),
  })

  return isPending ? true : data
}
