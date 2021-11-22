import { useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import { connectorLocalStorageKey } from '@pancakeswap/uikit'
import { profileClear } from '../state/profile'
import { resetUserNftState } from '../state/nftMarket/reducer'
import { clearAllTransactions } from '../state/transactions/actions'
import { useAppDispatch } from '../state'
import { connectorsByName } from '../utils/web3React'

export const useInactiveListener = () => {
  const { account, chainId, connector } = useWeb3React()
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (account && connector) {
      const handleDeactivate = () => {
        dispatch(profileClear())
        dispatch(resetUserNftState())
        // This localStorage key is set by @web3-react/walletconnect-connector
        if (window.localStorage.getItem('walletconnect')) {
          connectorsByName.walletconnect.close()
          connectorsByName.walletconnect.walletConnectProvider = null
        }
        window.localStorage.removeItem(connectorLocalStorageKey)
        if (chainId) {
          dispatch(clearAllTransactions({ chainId }))
        }
      }

      connector.addListener('Web3ReactDeactivate', handleDeactivate)

      return () => {
        connector.removeListener('Web3ReactDeactivate', handleDeactivate)
      }
    }
    return undefined
  }, [account, chainId, dispatch, connector])
}
