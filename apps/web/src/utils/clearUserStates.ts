import { configureScope } from '@sentry/nextjs'
import { AnyAction } from '@reduxjs/toolkit'
import { resetUserState, toggleFarmTransactionModal } from 'state/global/actions'
import { PREDICTION_TOOLTIP_DISMISS_KEY } from 'config/constants'
import { deleteCookie } from 'cookies-next'
import { AFFILIATE_SID } from 'pages/api/affiliates-program/affiliate-login'
import { StorageDispatchTypes } from 'hooks/useStorageDispatches'
import { LS_ORDERS } from './localStorageOrders'
import getLocalStorageItemKeys from './getLocalStorageItemKeys'

export const clearUserStates = (
  allDispatches: { [type in StorageDispatchTypes]: (action: AnyAction) => void },
  {
    chainId,
    newChainId,
  }: {
    chainId?: number
    newChainId?: number
  },
) => {
  Object.values(allDispatches).forEach((dispatch) => dispatch(resetUserState({ chainId, newChainId })))
  allDispatches[StorageDispatchTypes.TRANSACTION](toggleFarmTransactionModal({ showModal: false }))
  configureScope((scope) => scope.setUser(null))
  const lsOrderKeys = getLocalStorageItemKeys(LS_ORDERS)
  lsOrderKeys.forEach((lsOrderKey) => window?.localStorage?.removeItem(lsOrderKey))
  window?.localStorage?.removeItem(PREDICTION_TOOLTIP_DISMISS_KEY)
  deleteCookie(AFFILIATE_SID, { sameSite: true })
}
