import { ChainId } from '@pancakeswap/chains'
import { PredictionSupportedSymbol } from '@pancakeswap/prediction'
import LocalReduxProvider from 'contexts/LocalRedux/Provider'
import makeStore from 'contexts/LocalRedux/makeStore'
import { useActiveChainId } from 'hooks/useActiveChainId'
import _toUpper from 'lodash/toUpper'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import reducers, { initialState } from 'state/predictions'
import { usePredictionConfigs } from 'views/Predictions/hooks/usePredictionConfigs'
import { usePredictionToken } from 'views/Predictions/hooks/usePredictionToken'
import ConfigProvider from './ConfigProvider'

const PredictionConfigProviders = ({ children }) => {
  const router = useRouter()
  const { chainId } = useActiveChainId()
  const predictionConfigs = usePredictionConfigs()
  const [selectedPickedToken, setSelectedPickedToken] = useState('')
  const [prevSelectedToken, setPrevSelectedToken] = usePredictionToken()

  const supportedSymbol = useMemo(() => (predictionConfigs ? Object.keys(predictionConfigs) : []), [predictionConfigs])

  useEffect(() => {
    const upperToken = _toUpper(router?.query?.token as string) as PredictionSupportedSymbol

    if (supportedSymbol.includes(upperToken)) {
      setSelectedPickedToken(upperToken)

      const newData = {
        ...prevSelectedToken,
        ...(chainId && {
          [chainId]: upperToken,
        }),
      } as Record<ChainId, PredictionSupportedSymbol>
      setPrevSelectedToken(newData)

      return
    }

    // Set default to the first supported chain config.
    if (supportedSymbol.length) {
      const defaultTokenSymbol = supportedSymbol?.[0]
      router.replace(
        {
          pathname: router.pathname,
          query: {
            ...router.query,
            token: defaultTokenSymbol,
          },
        },
        undefined,
        { shallow: true },
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainId, supportedSymbol, router, setPrevSelectedToken])

  const selectedToken = useMemo(() => {
    if (supportedSymbol.includes(chainId && prevSelectedToken?.[chainId])) {
      return chainId && prevSelectedToken?.[chainId]
    }

    return selectedPickedToken || supportedSymbol?.[0]
  }, [chainId, prevSelectedToken, selectedPickedToken, supportedSymbol])

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
