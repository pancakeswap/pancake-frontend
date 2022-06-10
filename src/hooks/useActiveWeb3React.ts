import { useContext } from 'react'
import { Web3Provider } from '@ethersproject/providers'
// eslint-disable-next-line import/no-unresolved
import { Web3ReactContextInterface } from '@web3-react/core/dist/types'
import { ActiveWeb3ReactContext } from 'contexts/ActiveWeb3React'

/**
 * Provides a web3 provider with or without user's signer
 * Recreate web3 instance only if the provider change
 */
const useActiveWeb3React = (): Web3ReactContextInterface<Web3Provider> => {
  const activeWeb3ReactProvider = useContext(ActiveWeb3ReactContext)

  if (activeWeb3ReactProvider === undefined) {
    throw new Error('Active Web3ReactProvider context is undefined')
  }

  return activeWeb3ReactProvider
}

export default useActiveWeb3React
