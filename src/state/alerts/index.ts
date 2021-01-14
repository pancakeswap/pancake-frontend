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

      // Add alert to the list removing any existing alerts with the same id
      state.data = [...state.data.filter((alert) => alert.id === payload.id), payload]
    },
    remove: (state: AlertsState, action: PayloadAction<string>) => {
      state.data = state.data.filter((alert) => alert.id === action.payload)
    },
    clear: (state: AlertsState) => {
      state.data = []
    },
  },
})

// Actions
export const { clear, remove, push } = alertsSlice.actions

export default alertsSlice.reducer
