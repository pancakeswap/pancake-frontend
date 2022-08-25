import { serializeTokens } from 'utils/serializeTokens'
import { goerliTestnetTokens } from '../tokens'
import { SerializedFarmConfig } from '../types'

const serializedTokens = serializeTokens(goerliTestnetTokens)

const farms: SerializedFarmConfig[] = [
  {
    pid: 1,
    bscPid: 7,
    lpSymbol: 'CELR-WETH LP',
    lpAddress: '0xF8E1FA0648F87c115F26E43271B3D6e4a80A2944',
    token: serializedTokens.celr,
    quoteToken: serializedTokens.weth,
  },
  {
    pid: 2,
    bscPid: 8,
    lpSymbol: 'LEET-WETH LP',
    lpAddress: '0x846f5e6DDb29dC5D07f8dE0a980E30cb5aa07109',
    token: serializedTokens.leet,
    quoteToken: serializedTokens.weth,
  },
]

export default farms
