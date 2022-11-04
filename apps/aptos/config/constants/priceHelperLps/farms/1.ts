// import { serializeTokens } from '@pancakeswap/tokens/src/helpers'
import { ChainId, Pair } from '@pancakeswap/aptos-swap-sdk'
import type { SerializedFarmConfig } from '@pancakeswap/farms'
import { APT, L0_USDC } from 'config/coins'

const priceHelperLps: Omit<SerializedFarmConfig, 'pid'>[] = [
  {
    pid: null,
    lpSymbol: 'APT-USDC LP',
    token: APT[ChainId.MAINNET],
    quoteToken: L0_USDC[ChainId.MAINNET],
  },
].map((p) => ({
  ...p,
  token: p.token.serialize,
  quoteToken: p.quoteToken.serialize,
  lpAddress: Pair.getAddress(p.token, p.quoteToken),
}))

export default priceHelperLps
