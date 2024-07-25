import { ChainId } from '@pancakeswap/chains'
import { BCakeWrapperFarmConfig, PositionDetails } from '@pancakeswap/farms'
import { masterChefV3ABI, NFT_POSITION_MANAGER_ADDRESSES, nonfungiblePositionManagerABI } from '@pancakeswap/v3-sdk'
import BigNumber from 'bignumber.js'
import { masterChefV2ABI } from 'config/abi/masterchefV2'
import { v2BCakeWrapperABI } from 'config/abi/v2BCakeWrapper'
import { getCrossFarmingVaultAddress, getMasterChefV2Address, getMasterChefV3Address } from 'utils/addressHelpers'
import { getMasterChefV3Contract } from 'utils/contractHelpers'
import { publicClient } from 'utils/viem'
import { Address, encodeFunctionData, Hex } from 'viem'
import { decodeFunctionResult } from 'viem/_types/utils/abi/decodeFunctionResult'
import { StablePoolInfo, V2PoolInfo } from '../type'

export const getAccountV3TokenIdsInContract = async (
  chainId: number,
  account: Address,
  contractAddress: Address | undefined | null,
) => {
  const client = publicClient({ chainId })

  if (!contractAddress || !account || !client) {
    return []
  }

  const balance = await client.readContract({
    abi: masterChefV3ABI,
    address: contractAddress,
    functionName: 'balanceOf',
    args: [account] as const,
  })

  const tokenCalls = Array.from({ length: Number(balance) }, (_, i) => {
    return {
      abi: masterChefV3ABI,
      address: contractAddress,
      functionName: 'tokenOfOwnerByIndex',
      args: [account, i] as const,
    } as const
  })

  const tokenIds = await client.multicall({
    contracts: tokenCalls,
    allowFailure: false,
  })

  return tokenIds
}

export const getAccountV3TokenIds = async (chainId: number, account: Address) => {
  const masterChefV3Address = getMasterChefV3Address(chainId)
  const nftPositionManagerAddress = NFT_POSITION_MANAGER_ADDRESSES[chainId]

  const [farmingTokenIds, nonFarmTokenIds] = await Promise.all([
    getAccountV3TokenIdsInContract(chainId, account, masterChefV3Address),
    getAccountV3TokenIdsInContract(chainId, account, nftPositionManagerAddress),
  ])

  return {
    farmingTokenIds,
    nonFarmTokenIds,
  }
}

export const getV3PositionsFromTokenId = async (chainId: number, tokenIds: bigint[]): Promise<PositionDetails[]> => {
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
    } satisfies PositionDetails
  })
}

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

export const getAccountV2FarmingStakedBalances = async (
  chainId: number,
  account: Address,
  pools: Array<V2PoolInfo | StablePoolInfo>,
) => {
  const masterChefV2Address =
    chainId === ChainId.BSC ? getMasterChefV2Address(chainId) : getCrossFarmingVaultAddress(chainId)
  if (!account || !chainId || pools.length === 0 || !masterChefV2Address) return []

  const validPools = pools.filter(
    (pool) => ['v2', 'stable'].includes(pool.protocol) && pool.pid && pool.chainId === chainId,
  )
  const client = publicClient({ chainId })

  const balanceCalls = validPools.map((pool) => {
    return {
      abi: masterChefV2ABI,
      address: masterChefV2Address,
      functionName: 'userInfo',
      args: [BigInt(pool.pid!), account] as const,
    } as const
  })

  const balances = await client.multicall({
    contracts: balanceCalls,
    allowFailure: false,
  })

  return balances.map((balance) => {
    return new BigNumber(balance[0].toString()).toString()
  })
}

export const getAccountV2FarmingPendingCakeReward = async (
  chainId: number,
  account: Address,
  pools: Array<V2PoolInfo | StablePoolInfo>,
) => {
  const masterChefV2Address =
    chainId === ChainId.BSC ? getMasterChefV2Address(chainId) : getCrossFarmingVaultAddress(chainId)
  if (!account || !chainId || pools.length === 0 || !masterChefV2Address) return []

  const validPools = pools.filter(
    (pool) => ['v2', 'stable'].includes(pool.protocol) && pool.pid && pool.chainId === chainId,
  )
  const client = publicClient({ chainId })

  const earningCalls = validPools.map((pool) => {
    return {
      abi: masterChefV2ABI,
      address: masterChefV2Address,
      functionName: 'pendingCake',
      args: [BigInt(pool.pid!), account] as const,
    } as const
  })

  const earnings = await client.multicall({
    contracts: earningCalls,
    allowFailure: false,
  })

  return earnings.map((earning) => {
    return new BigNumber(earning.toString()).toString()
  })
}

export const getAccountV2FarmingBCakeWrapperEarning = async (
  chainId: number,
  account: Address,
  bCakeWrapperConfig: BCakeWrapperFarmConfig[],
) => {
  const client = publicClient({ chainId })

  if (!account || !chainId || bCakeWrapperConfig.length === 0) return []

  const validConfig = bCakeWrapperConfig.filter((pool) => pool.bCakeWrapperAddress && pool.chainId === chainId)

  const earningCalls = validConfig.map((pool) => {
    return {
      abi: v2BCakeWrapperABI,
      address: pool.bCakeWrapperAddress,
      functionName: 'pendingReward',
      args: [account] as const,
    } as const
  })

  const earnings = await client.multicall({
    contracts: earningCalls,
    allowFailure: false,
  })

  return earnings.map((earning) => {
    return new BigNumber(earning.toString()).toString()
  })
}
