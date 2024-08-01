import { ChainId } from '@pancakeswap/chains'
import { BCakeWrapperFarmConfig, Protocol, UNIVERSAL_FARMS } from '@pancakeswap/farms'
import { CurrencyAmount, erc20Abi, ERC20Token, Pair, pancakePairV2ABI } from '@pancakeswap/sdk'
import { LegacyStableSwapPair } from '@pancakeswap/smart-router/legacy-router'
import { deserializeToken } from '@pancakeswap/token-lists'
import { masterChefV3ABI, NFT_POSITION_MANAGER_ADDRESSES, nonfungiblePositionManagerABI } from '@pancakeswap/v3-sdk'
import BigNumber from 'bignumber.js'
import { infoStableSwapABI } from 'config/abi/infoStableSwap'
import { masterChefV2ABI } from 'config/abi/masterchefV2'
import { v2BCakeWrapperABI } from 'config/abi/v2BCakeWrapper'
import { BASES_TO_TRACK_LIQUIDITY_FOR, PINNED_PAIRS } from 'config/constants/exchange'
import { AppState } from 'state'
import { safeGetAddress } from 'utils'
import { getCrossFarmingVaultAddress, getMasterChefV2Address, getMasterChefV3Address } from 'utils/addressHelpers'
import { getMasterChefV3Contract } from 'utils/contractHelpers'
import { publicClient } from 'utils/viem'
import { Address, decodeFunctionResult, encodeFunctionData, Hex } from 'viem'
import { StablePoolInfo, V2PoolInfo } from '../type'
import { PositionDetail, StableLPDetail, V2LPDetail } from './type'

/**
 * Given two tokens return the liquidity token that represents its liquidity shares
 * @param tokenA one of the two tokens
 * @param tokenB the other token
 */
export function getV2LiquidityToken([tokenA, tokenB]: [ERC20Token, ERC20Token]): ERC20Token {
  return new ERC20Token(
    tokenA.chainId,
    Pair.getAddress(tokenA, tokenB),
    18,
    `${tokenA.symbol}-${tokenB.symbol} V2 LP`,
    'Pancake LPs',
  )
}

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

export const getV3PositionsFromTokenId = async (chainId: number, tokenIds: bigint[]): Promise<PositionDetail[]> => {
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

  const positions = await getV3PositionsFromTokenId(chainId, farmingTokenIds.concat(nonFarmTokenIds))

  const farmingTokenIdsLength = farmingTokenIds.length
  positions.forEach((_, index) => {
    positions[index].isStaked = index < farmingTokenIdsLength
  })

  return positions
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

// for v2 pools, we cannot fetch all positions from one contract
// so we simple get the most used pairs for fetch LP position
export const getTrackedV2LpTokens = (
  chainId: number,
  presetTokens: { [address: Address]: ERC20Token },
  userSavedPairs: AppState['user']['pairs'],
): [ERC20Token, ERC20Token][] => {
  const pairTokens = new Set<[ERC20Token, ERC20Token]>()
  // from farms
  UNIVERSAL_FARMS.filter((farm) => farm.protocol === 'v2' && farm.pid && farm.chainId === chainId).forEach((farm) => {
    pairTokens.add(farm.token0.sortsBefore(farm.token1) ? [farm.token0, farm.token1] : [farm.token1, farm.token0])
  })
  // from pinned pairs
  if (PINNED_PAIRS[chainId]) {
    PINNED_PAIRS[chainId].forEach((tokens: [ERC20Token, ERC20Token]) => {
      pairTokens.add(tokens)
    })
  }
  // from preset tokens and base tokens
  const baseTokens = BASES_TO_TRACK_LIQUIDITY_FOR[chainId]
  Object.entries(presetTokens).forEach(([address, token]) => {
    baseTokens.forEach((baseToken) => {
      const baseAddress = safeGetAddress(baseToken.address)
      if (baseAddress && safeGetAddress(address) !== baseAddress && token.chainId === chainId) {
        pairTokens.add(baseToken.sortsBefore(token) ? [baseToken, token] : [token, baseToken])
      }
    })
  })
  // from user saved pairs
  if (userSavedPairs[chainId]) {
    Object.values(userSavedPairs[chainId]).forEach((pair) => {
      const token0 = deserializeToken(pair.token0)
      const token1 = deserializeToken(pair.token1)
      pairTokens.add(token0.sortsBefore(token1) ? [token0, token1] : [token1, token0])
    })
  }

  return Array.from(pairTokens)
}

// @todo @ChefJerry add getAccountV2FarmingStakedBalances result
export const getAccountV2LpDetails = async (
  chainId: number,
  account: Address,
  reserveTokens: [ERC20Token, ERC20Token][],
): Promise<V2LPDetail[]> => {
  const client = publicClient({ chainId })
  const validReserveTokens = reserveTokens.filter((tokens) => tokens.every((token) => token.chainId === chainId))
  const lpTokens = validReserveTokens.map((tokens) => getV2LiquidityToken(tokens))
  if (!account || !client || !lpTokens.length) return []

  const validLpTokens = lpTokens.filter((token) => token.chainId === chainId)

  const balanceCalls = validLpTokens.map((token) => {
    return {
      abi: erc20Abi,
      address: token.address,
      functionName: 'balanceOf',
      args: [account] as const,
    } as const
  })
  const reserveCalls = validLpTokens.map((token) => {
    return {
      abi: pancakePairV2ABI,
      address: token.address,
      functionName: 'getReserves',
    } as const
  })
  const totalSupplyCalls = validLpTokens.map((token) => {
    return {
      abi: pancakePairV2ABI,
      address: token.address,
      functionName: 'totalSupply',
    } as const
  })
  const [balances, reserves, totalSupplies] = await Promise.all([
    client.multicall({
      contracts: balanceCalls,
      allowFailure: false,
    }),
    client.multicall({
      contracts: reserveCalls,
      allowFailure: false,
    }),
    client.multicall({
      contracts: totalSupplyCalls,
      allowFailure: false,
    }),
  ])

  return balances.map((_balance, index) => {
    const balance = CurrencyAmount.fromRawAmount(validLpTokens[index], _balance)
    const tokens = validReserveTokens[index]
    const [token0, token1] = tokens[0].sortsBefore(tokens[1]) ? tokens : tokens.reverse()
    const [reserve0, reserve1] = reserves[index]
    const pair = new Pair(
      CurrencyAmount.fromRawAmount(token0, reserve0.toString()),
      CurrencyAmount.fromRawAmount(token1, reserve1.toString()),
    )
    const totalSupply = CurrencyAmount.fromRawAmount(validLpTokens[index], totalSupplies[index].toString())
    const deposited0 = pair.getLiquidityValue(token0, totalSupply, balance, false)
    const deposited1 = pair.getLiquidityValue(token1, totalSupply, balance, false)
    return {
      balance,
      pair,
      totalSupply,
      deposited0,
      deposited1,
      protocol: Protocol.V2,
    }
  })
}

export const getStablePairDetails = async (
  chainId: number,
  account: Address,
  stablePairs: LegacyStableSwapPair[],
): Promise<StableLPDetail[]> => {
  const client = publicClient({ chainId })
  const validStablePairs = stablePairs.filter((pair) => pair.liquidityToken && pair.liquidityToken.chainId === chainId)

  if (!account || !client || !validStablePairs.length) return []

  const balanceCalls = validStablePairs.map((pair) => {
    return {
      abi: erc20Abi,
      address: pair.liquidityToken.address,
      functionName: 'balanceOf',
      args: [account] as const,
    } as const
  })
  const balances = await client.multicall({
    contracts: balanceCalls,
    allowFailure: false,
  })
  const validBalances = balances.reduce((acc, balance, index) => {
    if (balance && balance > 0n) {
      acc.push({
        balance,
        index,
      })
    }
    return acc
  }, [] as { balance: bigint; index: number }[])
  const calcCoinsAmountCalls = validBalances.map(({ balance, index }) => {
    const pair = validStablePairs[index]
    return {
      abi: infoStableSwapABI,
      address: pair.infoStableSwapAddress,
      functionName: 'calc_coins_amount',
      args: [pair.stableSwapAddress, balance] as const,
    } as const
  })

  const reserveResults = await client.multicall({
    contracts: calcCoinsAmountCalls,
    allowFailure: false,
  })
  let validIndex = 0
  return validStablePairs.map((pair, index) => {
    const balance = CurrencyAmount.fromRawAmount(pair.liquidityToken, balances[index])
    let token0Amount = 0n
    let token1Amount = 0n
    if (balance.greaterThan(0)) {
      ;[token0Amount, token1Amount] = reserveResults[validIndex]
      validIndex++
    }
    const { token0, token1 } = pair

    const deposited0 = CurrencyAmount.fromRawAmount(token0.wrapped, token0Amount.toString())
    const deposited1 = CurrencyAmount.fromRawAmount(token1.wrapped, token1Amount.toString())
    return {
      balance,
      pair,
      deposited0,
      deposited1,
      protocol: Protocol.STABLE,
    }
  })
}
