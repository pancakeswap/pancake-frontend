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
    lpSymbol: 'CAKE',
    lpAddress: '0x36e3E4fF6471559b19F66bD10985534d5e214D44',
    token: serializedTokens.syrup,
    quoteToken: serializedTokens.wbnb,
  },
  {
    pid: 3,
    lpSymbol: 'BUSD-CAKE LP',
    lpAddress: '0xb98C30fA9f5e9cf6749B7021b4DDc0DBFe73b73e',
    token: serializedTokens.busd,
    quoteToken: serializedTokens.cake,
  },
  {
    pid: 4,
    lpSymbol: 'CAKE-BNB LP',
    lpAddress: '0xa96818CA65B57bEc2155Ba5c81a70151f63300CD',
    token: serializedTokens.cake,
    quoteToken: serializedTokens.wbnb,
  },
  {
    pid: 10,
    lpSymbol: 'BNB-BUSD LP',
    lpAddress: '0x4E96D2e92680Ca65D58A0e2eB5bd1c0f44cAB897',
    token: serializedTokens.wbnb,
    quoteToken: serializedTokens.busd,
  },
  //    * V3 by order of release (some may be out of PID order due to multiplier boost)
  {
    pid: 9,
    lpSymbol: 'HBTC-WBTC LP',
    lpAddress: '0xc50eF16D5CCe3648057c5bF604025dCD633bd795',
    token: serializedTokens.hbtc,
    quoteToken: serializedTokens.wbtc,
    isStable: true,
  },
]

export default farms
