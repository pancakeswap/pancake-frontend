import { serializeTokens } from './tokens'
import { SerializedFarmConfig } from './types'

const serializedTokens = serializeTokens()

const farms: SerializedFarmConfig[] = [
  /**
   * These 3 farms (PID 0, 1, 4) should always be at the top of the file.
   */
  {
    pid: 0,
    lpSymbol: 'MORRALLA',
    lpAddresses: {
      97: '',
      56: '0x5625eb03d999817941bad868bbf8a0eaf0749557',
    },
    token: serializedTokens.morralla,
    quoteToken: serializedTokens.wbnb,
  },
  {
    pid: 1,
    lpSymbol: 'MORRALLA-BNB',
    lpAddresses: {
      97: '',
      56: '0x2a8a0d9f3e18b27b9de5b04cca02f229c9745d18',
    },
    token: serializedTokens.morralla,
    quoteToken: serializedTokens.wbnb,
  },
  {
    pid: 2,
    lpSymbol: 'MORRALLA-BUSD',
    lpAddresses: {
      97: '',
      56: '0x8E4b9AC4FA97530ECE7ddD477c2768F462684764',
    },
    token: serializedTokens.morralla,
    quoteToken: serializedTokens.busd,
  },
  /**
   * V3 by order of release (some may be out of PID order due to multiplier boost)
   */
  {
    pid: 4,
    lpSymbol: 'BUSD-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x58F876857a02D6762E0101bb5C46A8c1ED44Dc16',
    },
    token: serializedTokens.busd,
    quoteToken: serializedTokens.wbnb,
  },
]

export default farms
