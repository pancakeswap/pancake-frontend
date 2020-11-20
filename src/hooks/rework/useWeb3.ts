import { useEffect, useState, useRef } from 'react'
import Web3 from 'web3'
import { HttpProviderOptions } from 'web3-core-helpers'
import { provider as ProviderType } from 'web3-core'
import { useWallet } from 'use-wallet'

const RPC_URL = process.env.REACT_APP_RPC_URL
const httpProvider = new Web3.providers.HttpProvider(RPC_URL, {} as HttpProviderOptions)

/**
 * Provides a web3 instance using the provider provided by useWallet
 * with a fallback of an httpProver
 * Recreate web3 instance only if the ethereum provider change
 */
const useWeb3 = () => {
  const { ethereum }: { ethereum: ProviderType } = useWallet()
  const refEth = useRef(ethereum)
  const [web3, setweb3] = useState(new Web3(ethereum || httpProvider))

  useEffect(() => {
    if (ethereum !== refEth.current) {
      setweb3(new Web3(ethereum || httpProvider))
      refEth.current = ethereum
    }
  }, [ethereum])

  return web3
}

export default useWeb3
