import useSWR from 'swr'
import { ChainId } from '@pancakeswap/sdk'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { useVCakeContract } from 'hooks/useContract'

interface UseVCake {
  isInitialization: null | boolean
  refresh: () => void
}

const useVCake = (): UseVCake => {
  const { account, chainId } = useAccountActiveChain()
  const vCakeContract = useVCakeContract({ chainId })

  const { data, mutate } = useSWR(
    account && chainId === ChainId.BSC && ['/v-cake-initialization', account, chainId],
    async () => {
      try {
        const initialization = await vCakeContract.read.initialization([account])
        return initialization
      } catch (error) {
        console.error('[ERROR] Fetching vCake initialization', error)
        return null
      }
    },
  )

  return {
    isInitialization: data,
    refresh: mutate,
  }
}

export default useVCake
