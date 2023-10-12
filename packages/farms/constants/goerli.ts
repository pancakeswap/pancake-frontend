import { goerliTestnetTokens } from '@pancakeswap/tokens'
import { FeeAmount } from '@pancakeswap/v3-sdk'
import { getAddress } from 'viem'
import { SerializedFarmConfig } from '..'
import { defineFarmV3Configs } from '../src/defineFarmV3Configs'

export const farmsV3 = defineFarmV3Configs([
  {
    pid: 1,
    lpAddress: '0xC6D589DC1E1041a45d7347520bdaA113392E7249',
    token0: goerliTestnetTokens.mockB,
    token1: goerliTestnetTokens.mockA,
    feeAmount: FeeAmount.LOW,
  },
])

const farms: SerializedFarmConfig[] = [
  {
    pid: 34,
    vaultPid: 3,
    lpSymbol: 'CELR-WETH LP',
    lpAddress: '0xF8E1FA0648F87c115F26E43271B3D6e4a80A2944',
    quoteToken: goerliTestnetTokens.weth,
    token: goerliTestnetTokens.celr,
  },
  {
    pid: 23,
    vaultPid: 3,
    lpSymbol: 'LEET-WETH LP',
    lpAddress: '0x846f5e6DDb29dC5D07f8dE0a980E30cb5aa07109',
    quoteToken: goerliTestnetTokens.weth,
    token: goerliTestnetTokens.leet,
  },
].map((p) => ({
  ...p,
  token: p.token.serialize,
  quoteToken: p.quoteToken.serialize,
  lpAddress: getAddress(p.lpAddress),
}))

export default farms
