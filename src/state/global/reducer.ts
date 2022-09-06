/* eslint-disable no-param-reassign */
import { createReducer } from '@reduxjs/toolkit'
import { toggleFarmHarvestModal, pickFarmHarvestTx } from './actions'

export interface GlobalState {
  showFarmHarvestModal: boolean
  pickedFarmHarvestModalTx: string
}

export const initialState: GlobalState = {
  showFarmHarvestModal: false,
  pickedFarmHarvestModalTx: '',
}

export default createReducer(initialState, (builder) =>
  builder
    .addCase(toggleFarmHarvestModal, (state, { payload: { showModal } }) => {
      state.showFarmHarvestModal = showModal
    })
    .addCase(pickFarmHarvestTx, (state, { payload: { tx } }) => {
      state.pickedFarmHarvestModalTx = tx
      state.showFarmHarvestModal = true
    }),
)
