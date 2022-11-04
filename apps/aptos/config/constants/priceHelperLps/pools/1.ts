// import { serializeTokens } from '@pancakeswap/tokens/src/helpers'
import type { SerializedFarmConfig } from '@pancakeswap/farms'
// import { mainnetTokens } from 'config/constants/tokens'

// const serializedTokens = serializeTokens(mainnetTokens)

const priceHelperLps: SerializedFarmConfig[] = [
  /**
   * These LPs are just used to help with price calculation for MasterChef LPs (farms.ts).
   * This list is added to the MasterChefLps and passed to fetchFarm. The calls to get contract information about the token/quoteToken in the LP are still made.
   * The absence of a PID means the masterchef contract calls are skipped for this farm.
   * Prices are then fetched for all farms (masterchef + priceHelperLps).
   * Before storing to redux, farms without a PID are filtered out.
   */
]
// .map((p) => ({ ...p, token: p.token.serialize, quoteToken: p.quoteToken.serialize }))

export default priceHelperLps
