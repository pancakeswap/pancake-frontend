import { ethereumTokens } from '@pancakeswap/tokens'
import { SerializedFarmConfig } from '@pancakeswap/farms'

const farms: SerializedFarmConfig[] = [
  {
    pid: 8,
    vaultPid: 1,
    lpSymbol: 'ETH-USDC LP',
    lpAddress: '0x088Ecd1172838D4EB1A5CeC90e7A3640de8e384e',
    quoteToken: ethereumTokens.weth,
    token: ethereumTokens.usdc,
  },
].map((p) => ({ ...p, token: p.token.serialize, quoteToken: p.quoteToken.serialize }))

export default farms
