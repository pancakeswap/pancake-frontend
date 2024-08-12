import { Protocol } from '@pancakeswap/farms'
import { NFT_POSITION_MANAGER_ADDRESSES, nonfungiblePositionManagerABI } from '@pancakeswap/v3-sdk'
import { publicClient } from 'utils/viem'
import { Address } from 'viem'
import { PositionDetail } from '../../type'
import { getAccountV3TokenIds } from './getAccountV3TokenIds'

const readPositions = async (chainId: number, tokenIds: bigint[]): Promise<PositionDetail[]> => {
  const nftPositionManagerAddress = NFT_POSITION_MANAGER_ADDRESSES[chainId]
  const client = publicClient({ chainId })

  if (!client || !nftPositionManagerAddress || !tokenIds.length) {
    return []
  }

  const positionCalls = tokenIds.map((tokenId) => {
    return {
      abi: nonfungiblePositionManagerABI,
      address: nftPositionManagerAddress,
      functionName: 'positions',
      args: [tokenId] as const,
    } as const
  })

  const positions = await client.multicall({
    contracts: positionCalls,
    allowFailure: false,
  })

  return positions.map((position, index) => {
    const [
      nonce,
      operator,
      token0,
      token1,
      fee,
      tickLower,
      tickUpper,
      liquidity,
      feeGrowthInside0LastX128,
      feeGrowthInside1LastX128,
      tokensOwed0,
      tokensOwed1,
    ] = position
    return {
      tokenId: tokenIds[index],
      nonce,
      operator,
      token0,
      token1,
      fee,
      tickLower,
      tickUpper,
      liquidity,
      feeGrowthInside0LastX128,
      feeGrowthInside1LastX128,
      tokensOwed0,
      tokensOwed1,
      chainId,
      protocol: Protocol.V3,
    } satisfies PositionDetail
  })
}

export const getAccountV3Positions = async (chainId: number, account: Address): Promise<PositionDetail[]> => {
  const { farmingTokenIds, nonFarmTokenIds } = await getAccountV3TokenIds(chainId, account)

  const positions = await readPositions(chainId, farmingTokenIds.concat(nonFarmTokenIds))

  const farmingTokenIdsLength = farmingTokenIds.length
  positions.forEach((_, index) => {
    positions[index].isStaked = index < farmingTokenIdsLength
  })

  return positions
}
