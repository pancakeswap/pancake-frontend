import { Route } from './types'

export function isSameRoute(one: Route, another: Route) {
  if (one.pools.length !== another.pools.length) {
    return false
  }
  for (const [index, p] of one.pools.entries()) {
    if (p.type !== another.pools[index].type) {
      return false
    }
    if (p.getId() !== another.pools[index].getId()) {
      return false
    }
  }
  return true
}

// Must to be the same route
export function mergeRoute(one: Route, another: Route): Route {
  return {
    ...one,
    inputAmount: one.inputAmount.add(another.inputAmount),
    outputAmount: one.outputAmount.add(another.outputAmount),
    gasUseEstimateBase: another.gasUseEstimateBase
      ? one.gasUseEstimateBase.add(another.gasUseEstimateBase)
      : one.gasUseEstimateBase,
    gasUseEstimateQuote: another.gasUseEstimateQuote
      ? one.gasUseEstimateQuote.add(another.gasUseEstimateQuote)
      : one.gasUseEstimateQuote,
    gasUseEstimate: one.gasUseEstimate + another.gasUseEstimate,
    inputAmountWithGasAdjusted: another.inputAmountWithGasAdjusted
      ? one.inputAmountWithGasAdjusted?.add(another.inputAmountWithGasAdjusted)
      : one.inputAmountWithGasAdjusted,
    outputAmountWithGasAdjusted: another.outputAmountWithGasAdjusted
      ? one.outputAmountWithGasAdjusted?.add(another.outputAmountWithGasAdjusted)
      : one.outputAmountWithGasAdjusted,
    percent: one.percent + another.percent,
  }
}
