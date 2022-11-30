import { useEffect } from 'react'
import { useCurrency } from 'hooks/Tokens'
import { useSwapActionHandlers } from 'state/swap/useSwapActionHandlers'
import { Field } from 'state/swap/actions'
import { useSwapState } from 'state/swap/hooks'
import StableSwapForm from './components/StableSwapForm'
import useStableConfig, { StableConfigContext, useStableFarms } from './hooks/useStableConfig'

const StableSwapFormContainer = () => {
  const stableFarms = useStableFarms()

  const { onCurrencySelection } = useSwapActionHandlers()

  const stableTokenPair = stableFarms?.length ? stableFarms[0] : null

  useEffect(() => {
    if (stableTokenPair) {
      onCurrencySelection(Field.INPUT, stableTokenPair.token0)
      onCurrencySelection(Field.OUTPUT, stableTokenPair.token1)
    }
  }, [onCurrencySelection, stableTokenPair])

  const {
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId },
  } = useSwapState()

  const inputCurrency = useCurrency(inputCurrencyId)
  const outputCurrency = useCurrency(outputCurrencyId)

  const { stableSwapConfig, ...stableConfig } = useStableConfig({ tokenA: inputCurrency, tokenB: outputCurrency })

  return stableTokenPair ? (
    <StableConfigContext.Provider value={{ stableSwapConfig, ...stableConfig }}>
      <StableSwapForm />
    </StableConfigContext.Provider>
  ) : null
}

export default StableSwapFormContainer
