import { Currency } from '@pancakeswap/sdk'
import { logger } from '../utils/logger'

import { BaseRoute, Pool } from '../types'
import { buildBaseRoute, getOutputCurrency, involvesCurrency } from '../utils'

export function computeAllRoutes(input: Currency, output: Currency, candidatePools: Pool[], maxHops = 3): BaseRoute[] {
  logger.metric('Computing routes from', candidatePools.length, 'pools')
  const poolsUsed = Array<boolean>(candidatePools.length).fill(false)
  const routes: BaseRoute[] = []

  const computeRoutes = (
    currencyIn: Currency,
    currencyOut: Currency,
    currentRoute: Pool[],
    _previousCurrencyOut?: Currency,
  ) => {
    if (currentRoute.length > maxHops) {
      return
    }

    if (currentRoute.length > 0 && involvesCurrency(currentRoute[currentRoute.length - 1], currencyOut)) {
      routes.push(buildBaseRoute([...currentRoute], currencyIn, currencyOut))
      return
    }

    for (let i = 0; i < candidatePools.length; i++) {
      if (poolsUsed[i]) {
        // eslint-disable-next-line
        continue
      }

      const curPool = candidatePools[i]
      const previousCurrencyOut = _previousCurrencyOut || currencyIn

      if (!involvesCurrency(curPool, previousCurrencyOut)) {
        // eslint-disable-next-line
        continue
      }

      const currentTokenOut = getOutputCurrency(curPool, previousCurrencyOut)
      if (currencyIn.wrapped.equals(currentTokenOut.wrapped)) {
        // eslint-disable-next-line
        continue
      }

      currentRoute.push(curPool)
      poolsUsed[i] = true
      computeRoutes(currencyIn, currencyOut, currentRoute, currentTokenOut)
      poolsUsed[i] = false
      currentRoute.pop()
    }
  }

  computeRoutes(input, output, [])

  logger.metric('Computed routes from', candidatePools.length, 'pools', routes.length, 'routes')
  return routes
}
