import { ChainId } from '@pancakeswap/chains'
import { masterChefV3ABI } from '@pancakeswap/v3-sdk'
import { getMasterChefV3Contract } from 'utils/contractHelpers'
import { Address, decodeFunctionResult, encodeFunctionData, Hex } from 'viem'

export const getAccountV3FarmingPendingCakeReward = async (
  chainId: number,
  account: Address,
  tokenIds: bigint[],
): Promise<bigint[]> => {
  const masterChefV3 = getMasterChefV3Contract(undefined, chainId)
  const isZkSync = [ChainId.ZKSYNC, ChainId.ZKSYNC_TESTNET].includes(chainId)

  if (!masterChefV3 || !tokenIds.length) {
    return []
  }

  const harvestCalls: Hex[] = []

  tokenIds.forEach((tokenId) => {
    if (isZkSync) {
      harvestCalls.push(
        encodeFunctionData({
          abi: masterChefV3ABI,
          functionName: 'pendingCake',
          args: [tokenId],
        }),
      )
    } else {
      harvestCalls.push(
        encodeFunctionData({
          abi: masterChefV3ABI,
          functionName: 'harvest',
          args: [tokenId, account],
        }),
      )
    }
  })

  const { result } = await masterChefV3.simulate.multicall([harvestCalls], { account, value: 0n })

  return result.map((res) => {
    return decodeFunctionResult({
      abi: masterChefV3ABI,
      functionName: isZkSync ? 'pendingCake' : 'harvest',
      data: res,
    })
  })
}
