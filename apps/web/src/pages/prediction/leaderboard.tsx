import { SUPPORTED_CHAIN_IDS } from '@pancakeswap/prediction'
import PredictionsLeaderboard from '../../views/Predictions/Leaderboard'
import PredictionConfigProviders from '../../views/Predictions/context/PredictionConfigProviders'

export default function Leaderboard() {
  return <PredictionsLeaderboard />
}

Leaderboard.Layout = PredictionConfigProviders
Leaderboard.chains = SUPPORTED_CHAIN_IDS
