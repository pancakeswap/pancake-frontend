import { useQuery } from '@tanstack/react-query'
import { GAMIFICATION_API } from 'config/constants/endpoints'
import { useAccount } from 'wagmi'

export const useUserSocialStatus = () => {
  const { address: account } = useAccount()

  const { data } = useQuery({
    queryKey: ['useUserSocialStatus', account],

    queryFn: async () => {
      try {
        const response = await fetch(`${GAMIFICATION_API}/userInfo/v1/${account}`)
        const result = await response.json()
        console.log(result)

        return true
      } catch (error) {
        console.error('Fetch user social status error', error)
        return null
      }
    },

    enabled: Boolean(account),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })

  console.log('data', data)

  return null
}
