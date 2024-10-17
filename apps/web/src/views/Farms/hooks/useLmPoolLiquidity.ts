import { pancakeV3PoolABI } from '@pancakeswap/v3-sdk'
import { useQuery } from '@tanstack/react-query'
import { safeGetAddress, isAddressEqual } from 'utils'
import { publicClient } from 'utils/wagmi'
import { Address, parseAbiItem, zeroAddress } from 'viem'

const lmPoolAbi = [parseAbiItem('function lmLiquidity() view returns (uint128)')]
const fetchLmPoolLiquidity = async (lpAddress: Address, chainId: number): Promise<bigint> => {
  const client = publicClient({ chainId })
  if (!client) {
    return 0n
  }
  try {
    const lmPool = await client.readContract({
      address: lpAddress,
      abi: pancakeV3PoolABI,
      functionName: 'lmPool',
    })
    const lmPoolLiquidity = await client.readContract({
      address: lmPool,
      abi: lmPoolAbi,
      functionName: 'lmLiquidity',
    })

    return lmPoolLiquidity
  } catch (error) {
    console.error('Error fetching lm pool liquidity', error)
    return 0n
  }
}

export const useLmPoolLiquidity = (lpAddress?: Address, chainId?: number) => {
  const { data } = useQuery({
    queryKey: ['lmPoolLiquidity', lpAddress, chainId],
    queryFn: () => fetchLmPoolLiquidity(lpAddress!, chainId!),
    enabled: !!lpAddress && !!chainId && safeGetAddress(lpAddress) && !isAddressEqual(lpAddress, zeroAddress),
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  })
  return data
}
