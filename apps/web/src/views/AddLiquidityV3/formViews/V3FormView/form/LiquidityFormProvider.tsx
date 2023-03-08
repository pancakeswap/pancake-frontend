import { configureStore } from '@reduxjs/toolkit'
import LocalReduxProvider from 'contexts/LocalRedux/Provider'
import { useEffect, useState } from 'react'
import reducer from './reducer'

export default function LiquidityFormProvider({ children }) {
  const [formStore, setFormStore] = useState(null)

  useEffect(() => {
    // NOTE: Set Store when mounted to avoid leaked store to other LiquidityFormProvider instance
    setFormStore(
      configureStore({
        reducer,
      }),
    )
  }, [])

  return formStore ? <LocalReduxProvider store={formStore}>{children}</LocalReduxProvider> : null
}
