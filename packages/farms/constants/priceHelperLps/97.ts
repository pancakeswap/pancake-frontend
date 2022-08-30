import { SerializedFarmConfig } from '@pancakeswap/farms'
import { bscTestnetTokens } from '@pancakeswap/tokens'

const priceHelperLps: SerializedFarmConfig[] = [
  {
    pid: null,
    lpSymbol: 'WBNB-HBTC LP',
    lpAddress: '0x6642c3FE5718B5B20aF4e749BBE424Bb46979621',
    token: bscTestnetTokens.wbtc.serialize,
    quoteToken: bscTestnetTokens.wbnb.serialize,
  },
]

export default priceHelperLps
