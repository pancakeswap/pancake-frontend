import { configureScope } from '@sentry/nextjs'
import { Dispatch } from '@reduxjs/toolkit'
import { resetUserState, toggleFarmTransactionModal } from 'state/global/actions'
import { PREDICTION_TOOLTIP_DISMISS_KEY } from 'config/constants'
import { LS_ORDERS } from './localStorageOrders'
import getLocalStorageItemKeys from './getLocalStorageItemKeys'

export const clearUserStates = (
  dispatch: Dispatch<any>,
  {
    chainId,
    newChainId,
  }: {
    chainId?: number
    newChainId?: number
  },
) => {
  dispatch(resetUserState({ chainId, newChainId }))
  dispatch(toggleFarmTransactionModal({ showModal: false }))
  configureScope((scope) => scope.setUser(null))
  const lsOrderKeys = getLocalStorageItemKeys(LS_ORDERS)
  lsOrderKeys.forEach((lsOrderKey) => window?.localStorage?.removeItem(lsOrderKey))
  window?.localStorage?.removeItem(PREDICTION_TOOLTIP_DISMISS_KEY)
}
