import { useEffect, useState, useRef } from 'react'
import Web3 from 'web3'
import { HttpProviderOptions } from 'web3-core-helpers'
import { useWeb3React } from '@web3-react/core'
import getRpcUrl from 'utils/getRpcUrl'

const RPC_URL = getRpcUrl()
const httpProvider = new Web3.providers.HttpProvider(RPC_URL, { timeout: 10000 } as HttpProviderOptions)

/**
 * Provides a web3 instance using the provider provided by useWallet
 * with a fallback of an httpProver
 * Recreate web3 instance only if the provider change
 */
const useWeb3 = () => {
  const { library } = useWeb3React()
  const refEth = useRef(library)
  const [web3, setweb3] = useState(new Web3(library || httpProvider))

  useEffect(() => {
    if (library !== refEth.current) {
      setweb3(new Web3(library || httpProvider))
      refEth.current = library
    }
  }, [library])

  return web3
}

export default useWeb3
