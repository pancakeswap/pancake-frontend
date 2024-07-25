import { useQuery } from '@tanstack/react-query'
import { lpTokenABI } from 'config/abi/lpTokenAbi'
import { publicClient } from 'utils/viem'
import { Address } from 'viem'

const getV2LpTokenTotalSupply = async (lpAddress: Address, chainId: number): Promise<bigint> => {
  const client = publicClient({ chainId })
  if (!lpAddress) {
    return 0n
  }

  const totalSupply = await client.readContract({
    address: lpAddress,
    abi: lpTokenABI,
    functionName: 'totalSupply',
  })

  return totalSupply
}

export const useV2LpTokenTotalSupply = (lpAddress?: Address, chainId?: number) => {
  return useQuery({
    queryKey: ['v2LpTokenPrice', lpAddress, chainId],
    queryFn: () => getV2LpTokenTotalSupply(lpAddress!, chainId!),
    enabled: !!lpAddress && !!chainId,
  })
}
