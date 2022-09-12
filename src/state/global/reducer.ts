/* eslint-disable no-param-reassign */
import { createReducer } from '@reduxjs/toolkit'
import { toggleFarmTransactionModal, pickFarmHarvestTx } from './actions'

export interface GlobalState {
  showFarmTransactionModal: boolean
  pickedFarmTransactionModalTx: string
}

export const initialState: GlobalState = {
  showFarmTransactionModal: false,
  pickedFarmTransactionModalTx: '',
}

export default createReducer(initialState, (builder) =>
  builder
    .addCase(toggleFarmTransactionModal, (state, { payload: { showModal } }) => {
      state.showFarmTransactionModal = showModal
    })
    .addCase(pickFarmHarvestTx, (state, { payload: { tx } }) => {
      state.pickedFarmTransactionModalTx = tx
      state.showFarmTransactionModal = true
    }),
)
