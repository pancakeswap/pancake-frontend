import { SerializedFarmConfig } from '@pancakeswap/farms'
import { testnetTokens } from 'config/constants/tokens'

const farms: SerializedFarmConfig[] = [
  {
    pid: 1,
    lpSymbol: 'APT-MOON LP',
    lpAddress: '',
    quoteToken: testnetTokens.apt,
    token: testnetTokens.moon,
  },
].map((p) => ({ ...p, token: p.token.serialize, quoteToken: p.quoteToken.serialize }))

export default farms
