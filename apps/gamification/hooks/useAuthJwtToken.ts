import { useQuery } from '@tanstack/react-query'
import { GAMIFICATION_PUBLIC_API } from 'config/constants/endpoints'
import { useSiwe } from 'hooks/useSiwe'
import Cookies from 'js-cookie'
import { useAccount } from 'wagmi'

const PCS_GAMIFICATION_TOKEN = 'PCS_GAMIFICATION_TOKEN'

export const useAuthJwtToken = () => {
  const { address: account } = useAccount()
  const { siwe, fetchWithSiweAuthV2 } = useSiwe()
  const tokenInCookies = Cookies.get(PCS_GAMIFICATION_TOKEN)

  const { data } = useQuery({
    queryKey: ['fetch-auth-jwt-token', account],
    queryFn: async () => {
      try {
        const response = await fetchWithSiweAuthV2(`${GAMIFICATION_PUBLIC_API}/authenticate`)
        const result = await response.json()

        const [_, payload] = result.data.token.split('.')
        const decodedPayload = JSON.parse(atob(payload))
        return decodedPayload
      } catch (error) {
        console.error(`Fetch useAuthJwtToken error: ${error}`)
        return ''
      }
    },
    enabled: Boolean(account && !tokenInCookies && siwe),
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  })

  return {
    token: data ?? '',
  }
}
