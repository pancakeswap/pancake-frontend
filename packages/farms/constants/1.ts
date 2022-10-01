import { ethereumTokens } from '@pancakeswap/tokens'
import { SerializedFarmConfig } from '@pancakeswap/farms'

const farms: SerializedFarmConfig[] = [
  {
    pid: 1,
    vaultPid: 1,
    lpSymbol: 'ETH-USDT LP',
    lpAddress: '0xF8E1FA0648F87c115F26E43271B3D6e4a80A2944',
    quoteToken: ethereumTokens.weth,
    token: ethereumTokens.usdt,
  },
  {
    pid: 2,
    vaultPid: 2,
    lpSymbol: 'ETH-USDC LP',
    lpAddress: '0xF8E1FA0648F87c115F26E43271B3D6e4a80A2944',
    quoteToken: ethereumTokens.weth,
    token: ethereumTokens.usdc,
  },
  {
    pid: 3,
    vaultPid: 3,
    lpSymbol: 'ETH-WBTC LP',
    lpAddress: '0xF8E1FA0648F87c115F26E43271B3D6e4a80A2944',
    quoteToken: ethereumTokens.weth,
    token: ethereumTokens.wbtc,
  },
].map((p) => ({ ...p, token: p.token.serialize, quoteToken: p.quoteToken.serialize }))

export default farms
