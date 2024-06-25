import { useQuery } from '@tanstack/react-query'
import { MultiChainNameExtend, multiChainId, multiChainName } from 'state/info/constant'
import { useChainNameByQuery } from 'state/info/hooks'
import { getBlocksFromTimestamps } from 'utils/getBlocksFromTimestamps'

export const useBlocksFromTimestamps = (
  timestamps: number[],
  sortDirection: 'asc' | 'desc' | undefined = 'desc',
  targetChainName?: MultiChainNameExtend,
) => {
  const chainNameByQuery = useChainNameByQuery()
  const chainName = targetChainName ?? chainNameByQuery
  const chainId = multiChainId[chainName]
  const timestampsString = JSON.stringify(timestamps)
  const timestampsArray = JSON.parse(timestampsString)
  const { data } = useQuery({
    queryKey: [`info/blocks/${timestampsString}/${chainId}`, multiChainName[chainId] ?? chainName],
    queryFn: () => getBlocksFromTimestamps(timestampsArray, sortDirection, chainName),
    refetchOnReconnect: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  })
  return { blocks: data }
}
