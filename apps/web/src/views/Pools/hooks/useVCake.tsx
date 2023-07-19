import useSWR from 'swr'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { useVCakeContract } from 'hooks/useContract'

interface UseVCake {
  isInitialization: boolean
  refresh: () => void
}

const useVCake = (): UseVCake => {
  const { account, chainId } = useAccountActiveChain()
  const vCakeContract = useVCakeContract({ chainId })

  const { data, mutate } = useSWR(account && chainId && ['/v-cake-initialization', account, chainId], async () => {
    try {
      const initialization = await vCakeContract.read.initialization([account])
      return initialization
    } catch (error) {
      console.error('[ERROR] Fetching vCake initialization', error)
      return true
    }
  })

  return {
    isInitialization: data,
    refresh: mutate,
  }
}

export default useVCake
