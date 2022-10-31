import { SerializedFarmConfig } from '@pancakeswap/farms'
import { mainnetTokens } from 'config/constants/tokens'

const farms: SerializedFarmConfig[] = []
// .map((p) => ({ ...p, token: p.token.serialize, quoteToken: p.quoteToken.serialize }))

export default farms
