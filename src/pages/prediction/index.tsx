import predReducer, { initialState } from 'state/predictions'
import LocalReduxProvider from 'hooks/LocalRedux/Provider'
import Predictions from '../../views/Predictions'

export default () => {
  return (
    <LocalReduxProvider reducer={predReducer} initialState={initialState}>
      <Predictions />
    </LocalReduxProvider>
  )
}
