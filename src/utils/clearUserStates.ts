import * as Sentry from '@sentry/react'
import { Dispatch } from '@reduxjs/toolkit'
import { connectorLocalStorageKey } from '@pancakeswap/uikit'
import { profileClear } from '../state/profile'
import { resetUserNftState } from '../state/nftMarket/reducer'
import { clearAllTransactions } from '../state/transactions/actions'

export const clearUserStates = (dispatch: Dispatch<any>, chainId: number) => {
  dispatch(profileClear())
  dispatch(resetUserNftState())
  Sentry.configureScope((scope) => scope.setUser(null))
  window.localStorage.removeItem(connectorLocalStorageKey)
  if (chainId) {
    dispatch(clearAllTransactions({ chainId }))
  }
}
