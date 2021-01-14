/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AlertsState, Alert } from '../types'

const initialState: AlertsState = {
  data: [],
}

export const alertsSlice = createSlice({
  name: 'alerts',
  initialState,
  reducers: {
    push: (state: AlertsState, action: PayloadAction<Alert>) => {
      const { payload } = action
      const alertIndex = state.data.findIndex((alert) => alert.id === payload.id)

      // Remove old duplicate alert
      if (alertIndex >= 0) {
        state.data.splice(alertIndex, 1)
      }

      state.data.push(payload)
    },
    remove: (state: AlertsState, action: PayloadAction<string>) => {
      const alertIndex = state.data.findIndex((alert) => alert.id === action.payload)

      if (alertIndex >= 0) {
        state.data.splice(alertIndex, 1)
      }
    },
    clear: (state: AlertsState) => {
      state.data = []
    },
  },
})

// Actions
export const { clear, remove, push } = alertsSlice.actions

export default alertsSlice.reducer
