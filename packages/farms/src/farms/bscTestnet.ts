import { SerializedFarmConfig, UniversalFarmConfig } from '../types'

const pinnedFarmConfig: UniversalFarmConfig[] = []

export const bscTestnetFarmConfig: UniversalFarmConfig[] = [...pinnedFarmConfig]

export default bscTestnetFarmConfig

export const legacyFarmConfig: SerializedFarmConfig[] = []
