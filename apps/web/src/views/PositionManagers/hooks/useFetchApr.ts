import { ChainId } from '@pancakeswap/chains'
import { Address } from 'viem'
import { useQuery } from '@tanstack/react-query'
import { POSITION_MANAGER_API } from 'config/constants/endpoints'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { SUPPORTED_CHAIN_IDS as POSITION_MANAGERS_SUPPORTED_CHAINS } from '@pancakeswap/position-managers'

interface AprResponse {
  token0: number
  token1: number
  chainId: ChainId
  lpAddress: Address
  calculationDays: number
}

export const useFetchApr = () => {
  const { chainId } = useActiveChainId()
  const { data, refetch } = useQuery(
    ['/fetch-position-manager-apr', chainId],
    async () => {
      try {
        const response = await fetch(`${POSITION_MANAGER_API}/${chainId}/vault/ichi/feeAvg`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            avgFeeCalculationDays: '7',
          }),
        })

        const result: AprResponse[] = await response.json()
        console.log(result)
        return result
      } catch (error) {
        console.log(error)
        return null
      }
    },
    {
      enabled: !POSITION_MANAGERS_SUPPORTED_CHAINS[chainId],
      refetchOnWindowFocus: false,
      // refetchInterval: 30000,
      // staleTime: 30000,
      // cacheTime: 30000,
    },
  )

  return { data, refetch }
}
