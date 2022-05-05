import LocalReduxProvider from 'contexts/LocalRedux/Provider'
import makeStore from 'contexts/LocalRedux/makeStore'
import reducers, { initialState } from 'state/predictions'
import ConfigProvider, { config } from '../../views/Predictions/context/ConfigProvider'

import PredictionsLeaderboard from '../../views/Predictions/Leaderboard'

const store = makeStore(reducers, initialState, config)

export default () => {
  return (
    <ConfigProvider>
      <LocalReduxProvider store={store}>
        <PredictionsLeaderboard />
      </LocalReduxProvider>
    </ConfigProvider>
  )
}
