import { useState, useMemo, useEffect } from 'react'
import LocalReduxProvider from 'contexts/LocalRedux/Provider'
import makeStore from 'contexts/LocalRedux/makeStore'
import { ChainId } from '@pancakeswap/chains'
import { PredictionSupportedSymbol } from '@pancakeswap/prediction'
import reducers, { initialState } from 'state/predictions'
import { useRouter } from 'next/router'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { usePredictionConfigs } from 'views/Predictions/hooks/usePredictionConfigs'
import { usePredictionToken } from 'views/Predictions/hooks/usePredictionToken'
import _toUpper from 'lodash/toUpper'
import ConfigProvider from './ConfigProvider'

const PredictionConfigProviders = ({ children }) => {
  const { query } = useRouter()
  const { token } = query
  const { chainId } = useActiveChainId()
  const predictionConfigs = usePredictionConfigs()
  const [prevSelectedToken, setPrevSelectedToken] = usePredictionToken()

  const supportedSymbol = useMemo(() => (predictionConfigs ? Object.keys(predictionConfigs) : []), [predictionConfigs])

  const [selectedToken, setConfig] = useState(() => {
    if (supportedSymbol.includes(chainId && prevSelectedToken?.[chainId])) {
      return chainId && prevSelectedToken?.[chainId]
    }

    return supportedSymbol?.[0]
  })

  useEffect(() => {
    const upperToken = _toUpper(token as string) as PredictionSupportedSymbol

    if (supportedSymbol.includes(upperToken)) {
      setConfig(upperToken)

      const newData = {
        ...prevSelectedToken,
        ...(chainId && {
          [chainId]: upperToken,
        }),
      } as Record<ChainId, PredictionSupportedSymbol>
      setPrevSelectedToken(newData)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainId, supportedSymbol, token, setPrevSelectedToken])

  const config = useMemo(() => predictionConfigs?.[selectedToken], [predictionConfigs, selectedToken])

  const store = useMemo(() => makeStore(reducers, initialState, config), [config])

  if (!config) {
    return null
  }

  return (
    <ConfigProvider config={config}>
      <LocalReduxProvider store={store}>{children}</LocalReduxProvider>
    </ConfigProvider>
  )
}

export default PredictionConfigProviders
