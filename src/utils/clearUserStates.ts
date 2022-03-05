import * as Sentry from '@sentry/react'
import { Dispatch } from '@reduxjs/toolkit'
import { resetUserState } from 'state/global/actions'
import { clearAllTransactions } from 'state/transactions/actions'
import { connectorLocalStorageKey } from '@pancakeswap/uikit'
import { connectorsByName } from './web3React'

export const clearUserStates = (dispatch: Dispatch<any>, chainId: number) => {
  dispatch(resetUserState())
  Sentry.configureScope((scope) => scope.setUser(null))
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
