import { SUPPORTED_CHAIN_IDS } from '@pancakeswap/prediction'
import PredictionConfigProviders from '../../views/Predictions/context/PredictionConfigProviders'
import Predictions from '../../views/Predictions'

export default function Prediction() {
  return <Predictions />
}

Prediction.Layout = PredictionConfigProviders
Prediction.chains = SUPPORTED_CHAIN_IDS
