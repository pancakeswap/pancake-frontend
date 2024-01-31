import { getUserCreditWithTime } from '@pancakeswap/ifos'
import { useQuery } from '@tanstack/react-query'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { getViemClients } from 'utils/viem'

interface UseVeCakeUserCreditWithTime {
  userCreditWithTime: number
  refresh: () => void
}

export const useVeCakeUserCreditWithTime = (endTime: number): UseVeCakeUserCreditWithTime => {
  const { account, chainId } = useAccountActiveChain()

  const { data, refetch } = useQuery(
    ['vecake-user-credit-with-time', account, chainId],
    async () => {
      try {
        if (!account) {
          return 0
        }
        const response = await getUserCreditWithTime({ account, chainId, endTime, provider: getViemClients })
        return Number(response)
      } catch (error) {
        console.error('[ERROR] Fetching vCake initialization', error)
        return 0
      }
    },
    {
      enabled: Boolean(account && chainId && endTime),
    },
  )

  return {
    userCreditWithTime: data ?? 0,
    refresh: refetch,
  }
}
