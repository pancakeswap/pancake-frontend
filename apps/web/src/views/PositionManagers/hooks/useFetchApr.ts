import { ChainId } from '@pancakeswap/chains'
import { Address } from 'viem'
import { useQuery } from '@tanstack/react-query'
import { POSITION_MANAGER_API } from 'config/constants/endpoints'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { SUPPORTED_CHAIN_IDS as POSITION_MANAGERS_SUPPORTED_CHAINS } from '@pancakeswap/position-managers'

export interface AprDataInfo {
  token0: number
  token1: number
  chainId: ChainId
  lpAddress: Address
  calculationDays: number
}

export interface AprData {
  data: AprDataInfo[]
  isLoading: boolean
  refetch: () => void
}

export const useFetchApr = (): AprData => {
  const { chainId } = useActiveChainId()
  const { data, isLoading, refetch } = useQuery(
    ['/fetch-position-manager-apr', chainId],
    async () => {
      try {
        // const response = await fetch(`${POSITION_MANAGER_API}/${chainId}/vault/ichi/feeAvg`, {
        //   method: 'POST',
        //   headers: {
        //     Accept: 'application/json',
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify({
        //     avgFeeCalculationDays: '7',
        //   }),
        // })

        // const result: AprDataInfo[] = await response.json()
        // console.log(result)
        // return result

        return [
          {
            token0: 1239673096733967,
            token1: 4644178681397,
            chainId: ChainId.BSC,
            lpAddress: '0x63652e66Abd23d02537759f03314c333921915E1' as Address,
            calculationDays: 7,
          },
        ]
      } catch (error) {
        console.log(error)
        return []
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

  return { data, isLoading, refetch }
}
