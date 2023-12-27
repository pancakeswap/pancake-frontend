import { SUPPORTED_CHAIN_IDS } from '@pancakeswap/prediction'
import { configureStore } from '@reduxjs/toolkit'
import LocalReduxProvider from 'contexts/LocalRedux/Provider'
import { predictionsSlice } from 'state/predictions'
import PredictionsLeaderboard from 'views/Predictions/Leaderboard'

const formStore = configureStore({
  reducer: predictionsSlice.reducer,
})

export default function Leaderboard() {
  return (
    <LocalReduxProvider store={formStore}>
      <PredictionsLeaderboard />
    </LocalReduxProvider>
  )
}

Leaderboard.chains = SUPPORTED_CHAIN_IDS
