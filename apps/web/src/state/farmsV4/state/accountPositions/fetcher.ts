import memoize from 'lodash/memoize'
import uniqWith from 'lodash/uniqWith'
import { ChainId } from '@pancakeswap/chains'
import { BCakeWrapperFarmConfig, Protocol, UNIVERSAL_BCAKEWRAPPER_FARMS, UNIVERSAL_FARMS } from '@pancakeswap/farms'
import { CurrencyAmount, erc20Abi, ERC20Token, Pair, pancakePairV2ABI } from '@pancakeswap/sdk'
import { LegacyStableSwapPair } from '@pancakeswap/smart-router/legacy-router'
import { deserializeToken } from '@pancakeswap/token-lists'
import BigNumber from 'bignumber.js'
import { infoStableSwapABI } from 'config/abi/infoStableSwap'
import { masterChefV2ABI } from 'config/abi/masterchefV2'
import { v2BCakeWrapperABI } from 'config/abi/v2BCakeWrapper'
import { BASES_TO_TRACK_LIQUIDITY_FOR, PINNED_PAIRS } from 'config/constants/exchange'
import { AppState } from 'state'
import { safeGetAddress } from 'utils'
import { getCrossFarmingVaultAddress, getMasterChefV2Address } from 'utils/addressHelpers'
import { publicClient } from 'utils/viem'
import { Address, isAddressEqual } from 'viem'
import { StablePoolInfo, V2PoolInfo } from '../type'
import { StableLPDetail, V2LPDetail } from './type'

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

type ITokenPair = [ERC20Token, ERC20Token]
// for v2 pools, we cannot fetch all positions from one contract
// so we simple get the most used pairs for fetch LP position
export const getTrackedV2LpTokens = memoize(
  (
    chainId: number,
    presetTokens: { [address: Address]: ERC20Token },
    userSavedPairs: AppState['user']['pairs'],
  ): [ERC20Token, ERC20Token][] => {
    const pairTokens: ITokenPair[] = []
    // from farms
    UNIVERSAL_FARMS.filter((farm) => farm.protocol === 'v2' && farm.pid && farm.chainId === chainId).forEach((farm) => {
      pairTokens.push(farm.token0.sortsBefore(farm.token1) ? [farm.token0, farm.token1] : [farm.token1, farm.token0])
    })
    // from pinned pairs
    if (PINNED_PAIRS[chainId]) {
      PINNED_PAIRS[chainId].forEach((tokens: ITokenPair) => {
        pairTokens.push(tokens)
      })
    }
    // from preset tokens and base tokens
    const baseTokens = BASES_TO_TRACK_LIQUIDITY_FOR[chainId]
    Object.entries(presetTokens).forEach(([address, token]) => {
      baseTokens.forEach((baseToken) => {
        const baseAddress = safeGetAddress(baseToken.address)
        if (baseAddress && safeGetAddress(address) !== baseAddress && token.chainId === chainId) {
          pairTokens.push(baseToken.sortsBefore(token) ? [baseToken, token] : [token, baseToken])
        }
      })
    })
    // from user saved pairs
    if (userSavedPairs[chainId]) {
      Object.values(userSavedPairs[chainId]).forEach((pair) => {
        const token0 = deserializeToken(pair.token0)
        const token1 = deserializeToken(pair.token1)
        pairTokens.push(token0.sortsBefore(token1) ? [token0, token1] : [token1, token0])
      })
    }

    return uniqWith(pairTokens, (a: ITokenPair, b: ITokenPair) => a[0].equals(b[0]) && a[1].equals(b[1]))
  },
)

const V2_UNIVERSAL_FARMS = UNIVERSAL_FARMS.filter((farm) => farm.protocol === Protocol.V2)
const STABLE_UNIVERSAL_FARMS = UNIVERSAL_FARMS.filter((farm) => farm.protocol === Protocol.STABLE)

const getBCakeWrapperAddress = (lpAddress: Address, chainId: number) => {
  const f = UNIVERSAL_BCAKEWRAPPER_FARMS.find((farm) => {
    return isAddressEqual(farm.lpAddress, lpAddress) && farm.chainId === chainId
  })

  return f?.bCakeWrapperAddress ?? '0x'
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
  const bCakeWrapperAddresses = validReserveTokens.reduce((acc, tokens) => {
    const lpAddress = getV2LiquidityToken(tokens).address
    return [...acc, getBCakeWrapperAddress(lpAddress, chainId)]
  }, [] as Array<Address>)

  const balanceCalls = validLpTokens.map((token) => {
    return {
      abi: erc20Abi,
      address: token.address,
      functionName: 'balanceOf',
      args: [account] as const,
    } as const
  })
  const farmingCalls = bCakeWrapperAddresses
    .filter((addr) => addr !== '0x')
    .map((address) => {
      return {
        abi: v2BCakeWrapperABI,
        address,
        functionName: 'userInfo',
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
  const [balances, farming, reserves, totalSupplies] = await Promise.all([
    client.multicall({
      contracts: balanceCalls,
      allowFailure: false,
    }),
    client.multicall({
      contracts: farmingCalls,
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
    const nativeBalance = CurrencyAmount.fromRawAmount(validLpTokens[index], _balance)
    const farmingInfo = farming[index]
    let farmingBalance = CurrencyAmount.fromRawAmount(validLpTokens[index], '0')
    let farmingBoosterMultiplier = 0
    let farmingBoostedAmount = CurrencyAmount.fromRawAmount(validLpTokens[index], '0')
    if (farmingInfo) {
      farmingBalance = CurrencyAmount.fromRawAmount(validLpTokens[index], farmingInfo[0].toString())
      farmingBoosterMultiplier = Number(farmingInfo[1])
      farmingBoostedAmount = CurrencyAmount.fromRawAmount(validLpTokens[index], farmingInfo[2].toString())
    }
    const tokens = validReserveTokens[index]
    const [token0, token1] = tokens[0].sortsBefore(tokens[1]) ? tokens : tokens.reverse()
    const [reserve0, reserve1] = reserves[index]
    const pair = new Pair(
      CurrencyAmount.fromRawAmount(token0, reserve0.toString()),
      CurrencyAmount.fromRawAmount(token1, reserve1.toString()),
    )
    const totalSupply = CurrencyAmount.fromRawAmount(validLpTokens[index], totalSupplies[index].toString())
    const nativeDeposited0 = pair.getLiquidityValue(token0, totalSupply, nativeBalance, false)
    const nativeDeposited1 = pair.getLiquidityValue(token1, totalSupply, nativeBalance, false)
    const farmingDeposited0 = pair.getLiquidityValue(token0, totalSupply, farmingBalance, false)
    const farmingDeposited1 = pair.getLiquidityValue(token1, totalSupply, farmingBalance, false)
    const isStaked = !!V2_UNIVERSAL_FARMS.find((farm) => farm.lpAddress === pair.liquidityToken.address)
    return {
      nativeBalance,
      farmingBalance,
      pair,
      totalSupply,
      nativeDeposited0,
      nativeDeposited1,
      farmingDeposited0,
      farmingDeposited1,
      farmingBoosterMultiplier,
      farmingBoostedAmount,
      isStaked,
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
  const totalSupplyCalls = validStablePairs.map((pair) => {
    return {
      abi: erc20Abi,
      address: pair.liquidityToken.address,
      functionName: 'totalSupply',
    } as const
  })
  const [balances, totalSupplies] = await Promise.all([
    client.multicall({
      contracts: balanceCalls,
      allowFailure: false,
    }),
    client.multicall({
      contracts: totalSupplyCalls,
      allowFailure: false,
    }),
  ])
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
    const totalSupply = CurrencyAmount.fromRawAmount(pair.liquidityToken, totalSupplies[index].toString())
    const deposited0 = CurrencyAmount.fromRawAmount(token0.wrapped, token0Amount.toString())
    const deposited1 = CurrencyAmount.fromRawAmount(token1.wrapped, token1Amount.toString())

    const isStaked = !!STABLE_UNIVERSAL_FARMS.find((farm) => farm.lpAddress === pair.lpAddress)

    return {
      balance,
      pair,
      totalSupply,
      deposited0,
      deposited1,
      isStaked,
      protocol: Protocol.STABLE,
    }
  })
}
