import { bscTokens } from '@pancakeswap/tokens'
import { getAddress } from 'viem'
import { SerializedFarmConfig } from '../../types'

const priceHelperLps: SerializedFarmConfig[] = [
  /**
   * These LPs are just used to help with price calculation for MasterChef LPs (farms.ts).
   * This list is added to the MasterChefLps and passed to fetchFarm. The calls to get contract information about the token/quoteToken in the LP are still made.
   * The absence of a PID means the masterchef contract calls are skipped for this farm.
   * Prices are then fetched for all farms (masterchef + priceHelperLps).
   * Before storing to redux, farms without a PID are filtered out.
   */
  {
    pid: null,
    token: bscTokens.sd,
    quoteToken: bscTokens.wbnb,
    lpSymbol: 'WBNB-SD LP',
    lpAddress: '0xfD05C106E336bc5696686F422A35EE7a136E1C89',
  },
  {
    pid: null,
    token: bscTokens.sis,
    quoteToken: bscTokens.wbnb,
    lpSymbol: 'WBNB-SIS LP',
    lpAddress: '0xbCA9057666872B7b7CfC9718E68C96c64d69E1Ad',
  },
  {
    pid: null,
    token: bscTokens.xcad,
    quoteToken: bscTokens.busd,
    lpSymbol: 'XCAD-BUSD LP',
    lpAddress: '0x43d86605F8d22407b959D668B2689eafba23571B',
  },
].map((p) => ({
  ...p,
  token: p.token.serialize,
  quoteToken: p.quoteToken.serialize,
  lpAddress: getAddress(p.lpAddress),
}))

export default priceHelperLps
