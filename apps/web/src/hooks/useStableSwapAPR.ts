import { getAprsForStableFarm } from 'utils/getAprsForStableFarm'
import BigNumber from 'bignumber.js'
import { useGetChainName } from 'state/info/hooks'
import { useQuery } from '@tanstack/react-query'

const refreshIntervalForInfo = 15000 // 15s

export const useStableSwapAPR = (address: string | undefined): number | undefined => {
  const chainName = useGetChainName()
  const { data } = useQuery<BigNumber>(
    [`info/pool/stableAPR/${address}/`, chainName],
    () => getAprsForStableFarm(address),
    {
      enabled: Boolean(address),
      refetchInterval: refreshIntervalForInfo,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      retry: 3,
      retryDelay: 3000,
    },
  )
  return data?.toNumber()
}
