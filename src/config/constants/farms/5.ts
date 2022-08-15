import { serializeTokens } from 'utils/serializeTokens'
import { goerliTestnetTokens } from '../tokens'
import { SerializedFarmConfig } from '../types'

const serializedTokens = serializeTokens(goerliTestnetTokens)

const farms: SerializedFarmConfig[] = [
  {
    pid: 2,
    lpSymbol: 'CELR-WETH LP',
    lpAddresses: '0xF8E1FA0648F87c115F26E43271B3D6e4a80A2944',
    token: serializedTokens.celr,
    quoteToken: serializedTokens.weth,
  },
]

export default farms
