import { goerliTestnetTokens } from '@pancakeswap/tokens'
import { SerializedFarmConfig } from '@pancakeswap/farms'

const priceHelperLps: SerializedFarmConfig[] = [
  {
    pid: null,
    lpSymbol: 'WETH-USDC LP',
    lpAddress: '0xf5bf0C34d3c428A74Ceb98d27d38d0036C587200',
    quoteToken: goerliTestnetTokens.usdc,
    token: goerliTestnetTokens.weth,
  },
].map((p) => ({ ...p, token: p.token.serialize, quoteToken: p.quoteToken.serialize }))

export default priceHelperLps
