import { PRECISION } from '../../constants/binPool'
import { LiquidityConfig } from './liquidityConfigs'

const getTotalBins = (nbBinX: number, nbBinY: number) => {
  return nbBinX > 0 && nbBinY > 0 ? nbBinX + nbBinY - 1 : nbBinX + nbBinY
}

const getBinId = (activeId: number, i: number, nbBinY: number) => {
  const id = activeId + i

  return nbBinY > 0 ? id - nbBinY + 1 : id
}

export const getBinLiquidityConfigs = (args: { binId: number; nbBinX: number; nbBinY: number }): LiquidityConfig[] => {
  const { binId, nbBinX, nbBinY } = args
  const totalBins = getTotalBins(nbBinX, nbBinY)
  const configs: LiquidityConfig[] = []
  for (let index = 0; index < totalBins; index++) {
    const id = getBinId(binId, index, nbBinY)

    const distributionX = id >= binId && nbBinX > 0 ? PRECISION / BigInt(nbBinX) : 0n
    const distributionY = id <= binId && nbBinY > 0 ? PRECISION / BigInt(nbBinY) : 0n

    configs.push({ distributionX, distributionY, id: BigInt(id) })
  }

  return configs
}
