import { createContext, useRef, useState, useEffect } from 'react'
import noop from 'lodash/noop'
import { Web3ReactContextInterface } from '@web3-react/core/dist/types'
import { Web3Provider } from '@ethersproject/providers'
import { useWeb3React } from '@web3-react/core'
import { simpleRpcProvider } from '../../utils/providers'
import { CHAIN_ID } from '../../config/constants/networks'

export const ActiveWeb3ReactContext = createContext<Web3ReactContextInterface<Web3Provider>>({
  chainId: parseInt(CHAIN_ID, 10),
  activate: async () => {
    // do nothing.
  },
  active: false,
  setError: noop,
  deactivate: noop,
})

export const ActiveWeb3ReactProvider: React.FC = ({ children }) => {
  const { library, chainId, ...web3React } = useWeb3React()
  const refEth = useRef(library)
  const [provider, setProvider] = useState(library || simpleRpcProvider)

  useEffect(() => {
    if (library !== refEth.current) {
      setProvider(library || simpleRpcProvider)
      refEth.current = library
    }
  }, [library])

  return (
    <ActiveWeb3ReactContext.Provider
      value={{ library: provider, chainId: chainId ?? parseInt(CHAIN_ID, 10), ...web3React }}
    >
      {children}
    </ActiveWeb3ReactContext.Provider>
  )
}
