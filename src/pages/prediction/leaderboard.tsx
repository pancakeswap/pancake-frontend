import LocalReduxProvider from 'contexts/LocalRedux/Provider'
import makeStore from 'contexts/LocalRedux/makeStore'
import reducers, { initialState } from 'state/predictions'

import PredictionsLeaderboard from '../../views/Predictions/Leaderboard'

const store = makeStore(reducers, initialState)

export default () => {
  return (
    <LocalReduxProvider store={store}>
      <PredictionsLeaderboard />
    </LocalReduxProvider>
  )
}
