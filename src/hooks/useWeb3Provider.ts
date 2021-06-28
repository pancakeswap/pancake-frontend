import { useEffect, useState, useRef } from 'react'
import { ethers } from 'ethers'
import { useWeb3React } from '@web3-react/core'
import { simpleRpcProvider } from 'utils/providers'

/**
 * Provides a web3 provider with or without user's signer
 * Recreate web3 instance only if the provider change
 */
const useWeb3Provider = (): ethers.providers.JsonRpcProvider | ethers.providers.Web3Provider => {
  const { library } = useWeb3React()
  const refEth = useRef(library)
  const [provider, setprovider] = useState(library || simpleRpcProvider)

  useEffect(() => {
    if (library !== refEth.current) {
      setprovider(library || simpleRpcProvider)
      refEth.current = library
    }
  }, [library])

  return provider
}

export default useWeb3Provider
