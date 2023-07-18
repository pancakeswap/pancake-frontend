import useSWR from 'swr'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { useVCakeContract } from 'hooks/useContract'
import { ChainId } from '@pancakeswap/sdk'

interface UseVCake {
  isInitialization: boolean
}

const useVCake = (): UseVCake => {
  const { account, chainId } = useAccountActiveChain()
  const vCakeContract = useVCakeContract({ chainId: ChainId.BSC_TESTNET }) // TODO

  const { data } = useSWR(account && chainId && ['/v-cake-initialization', account, chainId], async () => {
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
  }
}

export default useVCake
