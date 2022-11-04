import type { SerializedFarmConfig } from '@pancakeswap/farms'

const farms: SerializedFarmConfig[] = []
// .map((p) => ({ ...p, token: p.token.serialize, quoteToken: p.quoteToken.serialize }))

export default farms
