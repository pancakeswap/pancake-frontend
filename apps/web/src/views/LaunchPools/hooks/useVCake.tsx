import { ChainId } from '@pancakeswap/chains'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { useVCakeContract } from 'hooks/useContract'
import { useQuery } from '@tanstack/react-query'

interface UseVCake {
  isInitialization?: boolean
  refresh: () => void
}

const useVCake = (): UseVCake => {
  const { account, chainId } = useAccountActiveChain()
  const vCakeContract = useVCakeContract({ chainId })

  const { data, refetch } = useQuery({
    queryKey: ['/v-cake-initialization', account, chainId],

    queryFn: async () => {
      if (!account) return undefined
      try {
        return await vCakeContract.read.initialization([account])
      } catch (error) {
        console.error('[ERROR] Fetching vCake initialization', error)
        return undefined
      }
    },

    enabled: Boolean(account && chainId === ChainId.BSC),
  })

  return {
    isInitialization: data,
    refresh: refetch,
  }
}

export default useVCake
