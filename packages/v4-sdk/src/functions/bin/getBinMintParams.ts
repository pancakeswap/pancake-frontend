import { PRECISION } from '../../constants/binPool'
import { BinPoolMintParams } from './calldatas/mint'
import { LiquidityConfig } from './liquidityConfigs'

const getTotalBins = (nbBinX: number, nbBinY: number) => {
  return nbBinX > 0 && nbBinY > 0 ? nbBinX + nbBinY - 1 : nbBinX + nbBinY
}

const getBinId = (activeId: number, i: number, nbBinY: number) => {
  const id = activeId + i

  return nbBinY > 0 ? id - nbBinY + 1 : id
}

export const getBinMintParams = (args: {
  binId: number
  amountX: bigint
  amountY: bigint
  nbBinX: number
  nbBinY: number
}): Pick<BinPoolMintParams, 'amountIn' | 'liquidityConfigs'> => {
  const { binId, amountX, amountY, nbBinX, nbBinY } = args
  const totalBins = getTotalBins(nbBinX, nbBinY)
  const configs: LiquidityConfig[] = []
  for (let index = 0; index < totalBins; index++) {
    const id = getBinId(binId, index, nbBinY)

    const distributionX = id >= binId && nbBinX > 0 ? PRECISION / BigInt(nbBinX) : 0n
    const distributionY = id <= binId && nbBinY > 0 ? PRECISION / BigInt(nbBinY) : 0n

    configs.push({ distributionX, distributionY, id: BigInt(id) })
  }

  return {
    amountIn: [amountX, amountY],
    liquidityConfigs: configs,
  }
}
