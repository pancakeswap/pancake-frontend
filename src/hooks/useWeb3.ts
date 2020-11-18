import Web3 from 'web3'
import { HttpProviderOptions } from 'web3-core-helpers'
import { provider as ProviderType } from 'web3-core'
import { useWallet } from 'use-wallet'
import { useRef } from 'react'

const RPC_URL = process.env.REACT_APP_RPC_URL

/**
 * Provides a web3 instance using the provider provided by useWallet
 * with a fallback of a new provider
 *
 * NOTE: I am not entirely sure we need to use the provider provided by useWallet
 *
 * @param httpProviderOptions
 */
const useWeb3 = (httpProviderOptions: HttpProviderOptions = {}) => {
  const { ethereum }: { ethereum: ProviderType } = useWallet()
  const provider = ethereum || new Web3.providers.HttpProvider(RPC_URL, httpProviderOptions)

  // Memoize the instance so hooks can safely use the web3 instance as a dependency
  const { current: web3 } = useRef(new Web3(provider))

  return web3
}

export default useWeb3
