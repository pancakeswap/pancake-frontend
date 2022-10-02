import { ethereumTokens } from '@pancakeswap/tokens'
import { SerializedFarmConfig } from '@pancakeswap/farms'

const farms: SerializedFarmConfig[] = [
  {
    pid: 2,
    vaultPid: 1,
    lpSymbol: 'ETH-USDT LP',
    lpAddress: '0x4e68ccd3e89f51c3074ca5072bbac773960dfa36',
    quoteToken: ethereumTokens.weth,
    token: ethereumTokens.usdt,
  },
].map((p) => ({ ...p, token: p.token.serialize, quoteToken: p.quoteToken.serialize }))

export default farms
