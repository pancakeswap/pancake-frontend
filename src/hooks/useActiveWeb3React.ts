import { CHAIN_IDS, useWeb3React } from '@pancakeswap/wagmi'
import { ChainId } from '@pancakeswap/sdk'
import { Web3Provider } from '@ethersproject/providers'
import { bscRpcProvider } from 'utils/providers'
import { useRouter } from 'next/router'

function useLocalNetworkChain() {
  const { query } = useRouter()

  const chainId = +query.chainId

  if (CHAIN_IDS.includes(chainId)) {
    return chainId
  }

  return undefined
}

/**
 * Provides a web3 provider with or without user's signer
 * Recreate web3 instance only if the provider change
 */
const useActiveWeb3React = () => {
  const localChainId = useLocalNetworkChain()
  const { library, chainId, ...web3React } = useWeb3React()

  return {
    library: (library ?? bscRpcProvider) as Web3Provider,
    chainId: chainId ?? localChainId ?? ChainId.BSC,
    ...web3React,
  }
}

export default useActiveWeb3React
