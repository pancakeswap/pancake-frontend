import { serializeTokens } from 'utils/serializeTokens'
import { bscTestnetTokens } from '../tokens'
import { SerializedFarmConfig } from '../types'

const serializedTokens = serializeTokens(bscTestnetTokens)

const farms: SerializedFarmConfig[] = [
  /**
   * These 3 farms (PID 0, 2, 3) should always be at the top of the file.
   */
  {
    pid: 0,
    v1pid: 0,
    lpSymbol: 'CAKE',
    lpAddress: '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82',
    token: serializedTokens.syrup,
    quoteToken: serializedTokens.wbnb,
  },
  {
    pid: 2,
    v1pid: 251,
    lpSymbol: 'CAKE-BNB LP',
    lpAddress: '0x3ed8936cAFDF85cfDBa29Fbe5940A5b0524824F4',
    token: serializedTokens.cake,
    quoteToken: serializedTokens.wbnb,
  },
  {
    pid: 3,
    v1pid: 252,
    lpSymbol: 'BUSD-BNB LP',
    lpAddress: '0xa35062141Fa33BCA92Ce69FeD37D0E8908868AAe',
    token: serializedTokens.busd,
    quoteToken: serializedTokens.wbnb,
  },
  //    * V3 by order of release (some may be out of PID order due to multiplier boost)
  {
    pid: 39,
    v1pid: 389,
    lpSymbol: 'CAKE-BUSD LP',
    lpAddress: '0x25293964dcaFd8a6cDf97AFF8b6559FD4A5Af864',
    token: serializedTokens.cake,
    quoteToken: serializedTokens.busd,
  },
]

export default farms
