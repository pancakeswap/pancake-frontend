import { createAction } from '@reduxjs/toolkit'
import { ChainId } from '@pancakeswap/sdk'

// fired once when the app reloads but before the app renders
// allows any updates to be applied to store data loaded from localStorage
export const updateVersion = createAction<void>('global/updateVersion')

export const resetUserState = createAction<{ chainId: ChainId; newChainId?: ChainId }>('global/resetUserState')

export const toggleFarmTransactionModal = createAction<{
  showModal: boolean
}>('transactions/toggleFarmTransactionModal')

export const pickFarmTransactionTx = createAction<{
  tx: string
  chainId: ChainId
}>('transactions/pickFarmTransactionTx')
