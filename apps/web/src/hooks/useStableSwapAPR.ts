import { useQuery } from '@tanstack/react-query'
import BigNumber from 'bignumber.js'
import { multiChainId } from 'state/info/constant'
import { useChainNameByQuery } from 'state/info/hooks'
import { getAprsForStableFarm } from 'utils/getAprsForStableFarm'

const refreshIntervalForInfo = 15000 // 15s

export const useStableSwapAPR = (address: string | undefined): number | undefined => {
  const chainName = useChainNameByQuery()
  const { data } = useQuery<BigNumber>({
    queryKey: [`info/pool/stableAPR/${address}/`, chainName],
    queryFn: () => getAprsForStableFarm(address, multiChainId[chainName!]),
    enabled: Boolean(address) && !!chainName,
    refetchInterval: refreshIntervalForInfo,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    retry: 3,
    retryDelay: 3000,
  })
  return data?.toNumber()
}
