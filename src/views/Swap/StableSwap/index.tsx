import stableSwapConfigs from 'config/constants/stableSwapConfigs'
import { useEffect } from 'react'
import { useSwapActionHandlers } from 'state/swap/useSwapActionHandlers'
import { Field } from 'state/swap/actions'
import StableSwapForm from './components/StableSwapForm'
import useStableConfig, { StableConfigContext } from './hooks/useStableConfig'

/**
 * NOTE:
 *  Since we only have one token pair at this moment, set static
 * Will add more tokens in demand
 */
const stableTokenPair = stableSwapConfigs[0]

const StableSwapFormContainer = ({ setIsChartDisplayed, isChartDisplayed }) => {
  const { onCurrencySelection } = useSwapActionHandlers()

  useEffect(() => {
    onCurrencySelection(Field.INPUT, stableTokenPair.token0)
    onCurrencySelection(Field.OUTPUT, stableTokenPair.token1)
  }, [onCurrencySelection])

  const { stableSwapConfig, ...stableConfig } = useStableConfig({
    pairA: stableTokenPair.token0,
    pairB: stableTokenPair.token1,
  })

  return stableSwapConfig ? (
    <StableConfigContext.Provider value={{ stableSwapConfig, ...stableConfig }}>
      <StableSwapForm setIsChartDisplayed={setIsChartDisplayed} isChartDisplayed={isChartDisplayed} />
    </StableConfigContext.Provider>
  ) : null
}

export default StableSwapFormContainer
