import { Pair } from '@pancakeswap/aptos-swap-sdk'
import type { SerializedFarmConfig } from '@pancakeswap/farms'
import { mainnetTokens } from '../tokens/index'

const farms: SerializedFarmConfig[] = [
  {
    pid: 1,
    lpSymbol: 'USDC-WETH LP',
    lpAddress:
      '0xc7efb4076dbe143cbcd98cfaaa929ecfc8f299203dfff63b95ccb6bfe19850fa::swap::LPToken<0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDC, 0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::WETH>',
    token: mainnetTokens.l0weth,
    quoteToken: mainnetTokens.l0usdc,
  },
  {
    pid: 0,
    lpSymbol: 'USDC-USDT LP',
    lpAddress:
      '0xc7efb4076dbe143cbcd98cfaaa929ecfc8f299203dfff63b95ccb6bfe19850fa::swap::LPToken<0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDC, 0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDT>',
    token: mainnetTokens.l0usdt,
    quoteToken: mainnetTokens.l0usdc,
  },
].map((p) => ({
  ...p,
  token: p.token.equals(p.quoteToken) ? p.token.serialize : Pair.sortToken(p.token, p.quoteToken)[1].serialize,
  quoteToken: p.token.equals(p.quoteToken)
    ? p.quoteToken.serialize
    : Pair.sortToken(p.token, p.quoteToken)[0].serialize,
}))

export default farms
