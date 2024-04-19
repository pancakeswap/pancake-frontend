import { useQuery } from '@tanstack/react-query'
import { publicClient } from 'utils/viem'
import { Address } from 'viem'
import { useChainId } from 'wagmi'

export const useIsContract = (address?: Address): boolean => {
  const chainId = useChainId()
  const { data } = useQuery({
    queryKey: ['isContract', address],
    queryFn: async () => {
      if (!address) return false
      const code = await publicClient({ chainId }).getBytecode({ address })
      return code !== '0x'
    },
    enabled: Boolean(address),
  })

  return data ?? false
}
