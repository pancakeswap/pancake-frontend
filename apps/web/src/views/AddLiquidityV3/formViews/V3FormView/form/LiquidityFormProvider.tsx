import { configureStore } from '@reduxjs/toolkit'
import LocalReduxProvider from 'contexts/LocalRedux/Provider'
import reducer from './reducer'

const formStore = configureStore({
  reducer,
})

export default function LiquidityFormProvider({ children }) {
  return <LocalReduxProvider store={formStore}>{children}</LocalReduxProvider>
}
