import { useState, useMemo } from 'react'
import LocalReduxProvider from 'contexts/LocalRedux/Provider'
import makeStore from 'contexts/LocalRedux/makeStore'
import { PredictionSupportedSymbol } from 'state/types'
import reducers, { initialState } from 'state/predictions'
import ConfigProvider from './ConfigProvider'
import configs from './config'

const PredictionConfigProviders = ({ children }) => {
  const [selectedToken, setConfig] = useState(PredictionSupportedSymbol.BNB)

  const config = useMemo(() => {
    return configs[selectedToken]
  }, [selectedToken])

  const store = useMemo(() => {
    return makeStore(reducers, initialState, config)
  }, [config])

  const configValue = useMemo(
    () => ({
      ...config,
      setConfig,
    }),
    [config],
  )

  return (
    <ConfigProvider config={configValue}>
      <LocalReduxProvider store={store}>{children}</LocalReduxProvider>
    </ConfigProvider>
  )
}

export default PredictionConfigProviders
