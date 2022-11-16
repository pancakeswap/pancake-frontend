import { Pair, ChainId } from '@pancakeswap/aptos-swap-sdk'
import type { SerializedFarmConfig } from '@pancakeswap/farms'
import { APT, L0_USDC } from '../../coins'
// import { mainnetTokens } from '../tokens/index'

const farms: SerializedFarmConfig[] = [
  {
    pid: 1,
    lpSymbol: 'APT-USDC LP',
    lpAddress:
      '0xc7efb4076dbe143cbcd98cfaaa929ecfc8f299203dfff63b95ccb6bfe19850fa::swap::LPToken<0x1::aptos_coin::AptosCoin, 0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDC>',
    token: L0_USDC[ChainId.MAINNET],
    quoteToken: APT[ChainId.MAINNET],
  },
].map((p) => ({
  ...p,
  token: p.token.equals(p.quoteToken) ? p.token.serialize : Pair.sortToken(p.token, p.quoteToken)[1].serialize,
  quoteToken: p.token.equals(p.quoteToken)
    ? p.quoteToken.serialize
    : Pair.sortToken(p.token, p.quoteToken)[0].serialize,
}))

export default farms
