import { configureStore } from '@reduxjs/toolkit'
import alertsReducer from './alerts'
import farmsReducer from './farms'
import poolsReducer from './pools'

export default configureStore({
  devTools: process.env.NODE_ENV !== 'production',
  reducer: {
    alerts: alertsReducer,
    farms: farmsReducer,
    pools: poolsReducer,
  },
})
