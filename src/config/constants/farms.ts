import { serializeTokens } from './tokens'
import { SerializedFarmConfig } from './types'
import { CHAIN_ID } from './networks'

const serializedTokens = serializeTokens()

const farms: SerializedFarmConfig[] = [
  /**
   * These 3 farms (PID 0, 2, 3) should always be at the top of the file.
   */
  {
    pid: 0,
    v1pid: 0,
    lpSymbol: 'MEGG',
    lpAddresses: {
      97: '',
      56: '0x39Af062b155978f1D41B299601DeFac54E94Cbd8',
    },
    token: serializedTokens.syrup,
    quoteToken: serializedTokens.wbnb,
  },
  {
    pid: 2,
    v1pid: 251,
    lpSymbol: 'MEGG-BNB LP',
    lpAddresses: {
      97: '0x39Af062b155978f1D41B299601DeFac54E94Cbd8',
      56: '0x39Af062b155978f1D41B299601DeFac54E94Cbd8',
    },
    token: serializedTokens.cake,
    quoteToken: serializedTokens.wbnb,
  },

].filter((f) => !!f.lpAddresses[CHAIN_ID])

export default farms
