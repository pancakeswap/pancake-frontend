import { ChainId } from '@pancakeswap/chains'
import { Gauge } from '@pancakeswap/gauges'
import { useQuery } from '@tanstack/react-query'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useAtomValue } from 'jotai'
import { gaugesInCapAtom } from 'state/vecake/atoms'

type Response = {
  data: Gauge[]
  lastUpdated: number
}

export const useGauges = () => {
  const { chainId } = useActiveChainId()
  const inCap = useAtomValue(gaugesInCapAtom)

  const { data, isLoading } = useQuery(
    ['gaugesVoting', chainId, inCap],
    async (): Promise<Gauge[]> => {
      const response = await fetch(
        `/api/gauges/getAllGauges?inCap=${inCap}&testnet=${chainId === ChainId.BSC_TESTNET ? 1 : ''}`,
      )
      if (response.ok) {
        const result = (await response.json()) as Response

        const gauges = result.data.map((gauge) => ({
          ...gauge,
          weight: BigInt(gauge.weight),
        }))

        return gauges
      }
      return [] as Gauge[]
    },
    {
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  )

  return {
    data,
    isLoading: isLoading || data?.length === 0,
  }
}
