import { useEffect } from 'react'
import { useSwapActionHandlers } from 'state/swap/useSwapActionHandlers'
import { Field } from 'state/swap/actions'
import StableSwapForm from './components/StableSwapForm'
import useStableConfig, { StableConfigContext, useStableFarms } from './hooks/useStableConfig'

const StableSwapFormContainer = ({ setIsChartDisplayed, isChartDisplayed }) => {
  const stableFarms = useStableFarms()

  const { onCurrencySelection } = useSwapActionHandlers()

  const stableTokenPair = stableFarms?.length ? stableFarms[0] : null

  useEffect(() => {
    if (stableTokenPair) {
      onCurrencySelection(Field.INPUT, stableTokenPair.token0)
      onCurrencySelection(Field.OUTPUT, stableTokenPair.token1)
    }
  }, [onCurrencySelection, stableTokenPair])

  const { stableSwapConfig, ...stableConfig } = useStableConfig({
    tokenA: stableTokenPair?.token0,
    tokenB: stableTokenPair?.token1,
  })

  return stableTokenPair ? (
    <StableConfigContext.Provider value={{ stableSwapConfig, ...stableConfig }}>
      <StableSwapForm setIsChartDisplayed={setIsChartDisplayed} isChartDisplayed={isChartDisplayed} />
    </StableConfigContext.Provider>
  ) : null
}

export default StableSwapFormContainer
