import { SerializedFarmConfig } from '../types'
import { goerliTestnetTokens } from '../tokens'

const priceHelperLps: SerializedFarmConfig[] = [
  {
    pid: null,
    lpSymbol: 'WETH-USDC LP',
    lpAddress: '0xf5bf0C34d3c428A74Ceb98d27d38d0036C587200',
    token: goerliTestnetTokens.weth,
    quoteToken: goerliTestnetTokens.usdc,
  },
]

export default priceHelperLps
