import LocalReduxProvider from 'contexts/LocalRedux/Provider'
import makeStore from 'contexts/LocalRedux/makeStore'
import reducers, { initialState } from 'state/predictions'
import ConfigProvider from './ConfigProvider'

const configProviderFactory = (config) => {
  const store = makeStore(reducers, initialState, config)

  return ({ children }) => {
    return (
      <ConfigProvider config={config}>
        <LocalReduxProvider store={store}>{children}</LocalReduxProvider>
      </ConfigProvider>
    )
  }
}

export default configProviderFactory
