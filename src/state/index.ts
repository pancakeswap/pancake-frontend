import { configureStore } from '@reduxjs/toolkit'
import { NODE_ENV } from 'config'
import farmsReducer from './farms'
import toastsReducer from './toasts'
import poolsReducer from './pools'
import pricesReducer from './prices'
import profileReducer from './profile'
import teamsReducer from './teams'
import achievementsReducer from './achievements'

export default configureStore({
  devTools: NODE_ENV !== 'production',
  reducer: {
    farms: farmsReducer,
    toasts: toastsReducer,
    pools: poolsReducer,
    prices: pricesReducer,
    profile: profileReducer,
    teams: teamsReducer,
    achievements: achievementsReducer,
  },
})
