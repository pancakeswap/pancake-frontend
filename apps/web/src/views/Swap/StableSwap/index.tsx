import { useCurrency } from 'hooks/Tokens'
import { useEffect } from 'react'
import { Field } from 'state/swap/actions'
import { useSwapState } from 'state/swap/hooks'
import { useStableSwapPairs } from 'state/swap/useStableSwapPairs'
import { useSwapActionHandlers } from 'state/swap/useSwapActionHandlers'
import StableSwapForm from './components/StableSwapForm'
import useStableConfig, { StableConfigContext } from './hooks/useStableConfig'

const StableSwapFormContainer = () => {
  const stablePairs = useStableSwapPairs()

  const { onCurrencySelection } = useSwapActionHandlers()

  const stableTokenPair = stablePairs?.length ? stablePairs[0] : null

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

  const stableConfig = useStableConfig({ tokenA: inputCurrency, tokenB: outputCurrency })

  return stableTokenPair ? (
    <StableConfigContext.Provider value={stableConfig}>
      <StableSwapForm />
    </StableConfigContext.Provider>
  ) : null
}

export default StableSwapFormContainer
