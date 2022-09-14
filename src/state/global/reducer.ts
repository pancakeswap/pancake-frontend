/* eslint-disable no-param-reassign */
import { createReducer } from '@reduxjs/toolkit'
import { ChainId } from '@pancakeswap/sdk'
import { toggleFarmTransactionModal, pickFarmTransactionTx } from './actions'

export interface GlobalState {
  showFarmTransactionModal: boolean
  pickedFarmTransactionModalTx: {
    tx: string
    chainId: ChainId
  }
}

export const initialState: GlobalState = {
  showFarmTransactionModal: false,
  pickedFarmTransactionModalTx: {
    tx: '',
    chainId: ChainId.BSC,
  },
}

export default createReducer(initialState, (builder) =>
  builder
    .addCase(toggleFarmTransactionModal, (state, { payload: { showModal } }) => {
      state.showFarmTransactionModal = showModal
    })
    .addCase(pickFarmTransactionTx, (state, { payload: { tx, chainId } }) => {
      state.pickedFarmTransactionModalTx = { tx, chainId }
      state.showFarmTransactionModal = true
    }),
)
