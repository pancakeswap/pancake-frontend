// import { serializeTokens } from '@pancakeswap/tokens/src/helpers'
import { ChainId, Pair } from '@pancakeswap/aptos-swap-sdk'
import type { SerializedFarmConfig } from '@pancakeswap/farms'
import { APT, L0_USDC } from 'config/coins'
// import { testnetTokens } from 'config/constants/tokens'

// const serializedTokens = serializeTokens(testnetTokens)

const priceHelperLps: Omit<SerializedFarmConfig, 'pid'>[] = [
  {
    lpSymbol: 'APT-USDC LP',
    quoteToken: APT[ChainId.TESTNET],
    token: L0_USDC[ChainId.TESTNET],
  },
].map((p) => ({
  ...p,
  token: p.token.serialize,
  quoteToken: p.quoteToken.serialize,
  lpAddress: Pair.getAddress(p.token, p.quoteToken),
}))

export default priceHelperLps
