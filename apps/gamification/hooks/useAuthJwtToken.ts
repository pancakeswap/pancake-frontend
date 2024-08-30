import { useQuery } from '@tanstack/react-query'
import { GAMIFICATION_PUBLIC_API } from 'config/constants/endpoints'
import { useSiwe } from 'hooks/useSiwe'
import Cookies from 'js-cookie'
import { useAccount } from 'wagmi'

const PCS_GAMIFICATION_TOKEN = 'PCS_GAMIFICATION_TOKEN'

export const useAuthJwtToken = () => {
  const { address: account, chainId } = useAccount()
  const { signIn } = useSiwe()
  const getCookieName = `${PCS_GAMIFICATION_TOKEN}-${account}`
  const tokenInCookies = Cookies.get(getCookieName)

  const { data } = useQuery({
    queryKey: ['fetch-auth-jwt-token', account],
    queryFn: async () => {
      try {
        if (!account || !chainId) {
          throw new Error('Unable to fetch jwt data')
        }

        const { message, signature } = await signIn({ address: account, chainId })

        const queryString = new URLSearchParams({
          userId: account,
          signature,
          encodedMessage: encodeURIComponent(message),
        }).toString()

        const response = await fetch(`${GAMIFICATION_PUBLIC_API}/authenticate?${queryString}`)
        const result = await response.json()

        const [_, payload] = result.token.split('.')
        const decodedPayload = JSON.parse(atob(payload))
        const expDate = decodedPayload?.exp

        if (expDate && result?.token) {
          Cookies.set(getCookieName, result.token, { expires: new Date(expDate * 1000) })
        }

        return result?.token ?? ''
      } catch (error) {
        console.error(`Fetch useAuthJwtToken error: ${error}`)
        return ''
      }
    },
    enabled: Boolean(account && !tokenInCookies),
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  })

  return {
    token: data ?? '',
  }
}
