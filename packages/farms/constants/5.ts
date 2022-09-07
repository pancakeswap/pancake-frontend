import { goerliTestnetTokens } from '@pancakeswap/tokens'
import { SerializedFarmConfig } from '@pancakeswap/farms'

const farms: SerializedFarmConfig[] = [
  {
    pid: 7,
    vaultPid: 1,
    lpSymbol: 'CELR-WETH LP',
    lpAddress: '0xF8E1FA0648F87c115F26E43271B3D6e4a80A2944',
    quoteToken: goerliTestnetTokens.weth,
    token: goerliTestnetTokens.celr,
  },
  {
    pid: 8,
    vaultPid: 2,
    lpSymbol: 'LEET-WETH LP',
    lpAddress: '0x846f5e6DDb29dC5D07f8dE0a980E30cb5aa07109',
    quoteToken: goerliTestnetTokens.weth,
    token: goerliTestnetTokens.leet,
  },
].map((p) => ({ ...p, token: p.token.serialize, quoteToken: p.quoteToken.serialize }))

export default farms
