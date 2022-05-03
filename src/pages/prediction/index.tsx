import predReducer, { initialState } from 'state/predictions'
import LocalReduxProvider from 'hooks/LocalRedux/Provider'
import { AnyAction, Reducer } from '@reduxjs/toolkit'

import { PredictionsState } from 'state/types'
import Predictions from '../../views/Predictions'

export default () => {
  return (
    <LocalReduxProvider<PredictionsState, Reducer<PredictionsState, AnyAction>>
      reducer={predReducer}
      initialState={initialState}
    >
      <Predictions />
    </LocalReduxProvider>
  )
}
