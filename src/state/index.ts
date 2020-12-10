import { configureStore } from '@reduxjs/toolkit'
import farmsReducer from './farms'

export default configureStore({
  devTools: process.env.NODE_ENV !== 'production',
  reducer: {
    farms: farmsReducer,
  },
})
