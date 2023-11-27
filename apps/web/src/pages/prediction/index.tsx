import { PREDICTION_SUPPORTED_CHAINS } from 'config/constants/supportChains'
import PredictionConfigProviders from '../../views/Predictions/context/PredictionConfigProviders'
import Predictions from '../../views/Predictions'

export default function Prediction() {
  return <Predictions />
}

Prediction.Layout = PredictionConfigProviders
Prediction.chains = PREDICTION_SUPPORTED_CHAINS
