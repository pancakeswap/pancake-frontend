import { createReducer } from '@reduxjs/toolkit'
import { fetchBalance } from "./actions"

interface globalState {
    balance:string
}

export const initialState: globalState = {
    balance:"0"
}

export default createReducer(initialState, (builder) =>
  builder
    .addCase(fetchBalance, (state, action) => {
      state.balance = action.payload.balance
    })
)