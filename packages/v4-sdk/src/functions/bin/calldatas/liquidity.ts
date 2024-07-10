import { Address, encodeFunctionData } from 'viem'
import { BinFungiblePositionManagerAbi } from '../../../abis/BinFungiblePositionManager'
import { PoolKey } from '../../../types'
import { encodePoolKey } from '../../../utils/encodePoolKey'

export type AddBinLiquidityParams = {
  poolKey: PoolKey<'Bin'>
  amount0: bigint
  amount1: bigint
  amount0Min: bigint
  amount1Min: bigint
  activeIdDesired: bigint
  idSlippage: bigint
  deltaIds: bigint[]
  distributionX: bigint[]
  distributionY: bigint[]
  to: Address
  deadline: bigint
}

export const binPoolAddLiquidityCalldata = (params: AddBinLiquidityParams) => {
  return encodeFunctionData({
    abi: BinFungiblePositionManagerAbi,
    functionName: 'addLiquidity',
    args: [
      {
        ...params,
        poolKey: encodePoolKey(params.poolKey),
      },
    ],
  })
}

export type RemoveBinLiquidityParams = {
  poolKey: PoolKey<'Bin'>
  amount0Min: bigint
  amount1Min: bigint
  ids: bigint[]
  amounts: bigint[]
  from: Address
  to: Address
  deadline: bigint
}

export const binPoolRemoveLiquidityCalldata = (params: RemoveBinLiquidityParams) => {
  return encodeFunctionData({
    abi: BinFungiblePositionManagerAbi,
    functionName: 'removeLiquidity',
    args: [
      {
        ...params,
        poolKey: encodePoolKey(params.poolKey),
      },
    ],
  })
}
