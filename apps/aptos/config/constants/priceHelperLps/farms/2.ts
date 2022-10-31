// import { serializeTokens } from '@pancakeswap/tokens/src/helpers'
import { SerializedFarmConfig } from '@pancakeswap/farms'
// import { testnetTokens } from 'config/constants/tokens'

// const serializedTokens = serializeTokens(testnetTokens)

const priceHelperLps: SerializedFarmConfig[] = [
  // {
  //   pid: null,
  //   lpSymbol: 'APT-MOON LP',
  //   lpAddress: '',
  //   quoteToken: serializedTokens.apt,
  //   token: serializedTokens.moon,
  // },
]
// .map((p) => ({ ...p, token: p.token.serialize, quoteToken: p.quoteToken.serialize }))

export default priceHelperLps
