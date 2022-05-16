import * as Sentry from '@sentry/react'
import { Dispatch } from '@reduxjs/toolkit'
import { resetUserState } from 'state/global/actions'
import { connectorLocalStorageKey } from '@pancakeswap/uikit'
import { connectorsByName } from './web3React'
import { LS_ORDERS } from './localStorageOrders'
import getLocalStorageItemKeys from './getLocalStorageItemKeys'

export const clearUserStates = (dispatch: Dispatch<any>, chainId: number) => {
  dispatch(resetUserState({ chainId }))
  Sentry.configureScope((scope) => scope.setUser(null))
  // This localStorage key is set by @web3-react/walletconnect-connector
  if (window?.localStorage?.getItem('walletconnect')) {
    connectorsByName.walletconnect.close()
    connectorsByName.walletconnect.walletConnectProvider = null
  }
  window?.localStorage?.removeItem(connectorLocalStorageKey)
  const lsOrderKeys = getLocalStorageItemKeys(LS_ORDERS)
  lsOrderKeys.forEach((lsOrderKey) => window?.localStorage?.removeItem(lsOrderKey))
}
