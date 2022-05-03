import LocalReduxProvider from 'contexts/LocalRedux/Provider'
import makeStore from 'contexts/LocalRedux/makeStore'
import reducers, { initialState } from 'state/predictions'
import Predictions from '../../views/Predictions'

const store = makeStore(reducers, initialState)

export default () => {
  return (
    <LocalReduxProvider store={store}>
      <Predictions />
    </LocalReduxProvider>
  )
}
