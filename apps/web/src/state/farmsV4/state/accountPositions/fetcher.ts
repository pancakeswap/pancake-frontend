import { BCakeWrapperFarmConfig, Protocol, UNIVERSAL_FARMS, UNIVERSAL_FARMS_MAP } from '@pancakeswap/farms'
import { CurrencyAmount, ERC20Token, Pair, Token, pancakePairV2ABI } from '@pancakeswap/sdk'
import { LegacyStableSwapPair } from '@pancakeswap/smart-router/legacy-router'
import { deserializeToken } from '@pancakeswap/token-lists'
import BigNumber from 'bignumber.js'
import { infoStableSwapABI } from 'config/abi/infoStableSwap'
import { v2BCakeWrapperABI } from 'config/abi/v2BCakeWrapper'
import { BASES_TO_TRACK_LIQUIDITY_FOR, PINNED_PAIRS } from 'config/constants/exchange'
import memoize from 'lodash/memoize'
import uniqWith from 'lodash/uniqWith'
import { AppState } from 'state'
import { safeGetAddress } from 'utils'
import { publicClient } from 'utils/viem'
import { Address, erc20Abi, zeroAddress } from 'viem'
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

  const earnings = await client
    .multicall({
      contracts: earningCalls,
      allowFailure: true,
    })
    .then((res) => res.map((item) => item.result ?? 0n))

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
    UNIVERSAL_FARMS.filter(
      (farm) => farm.protocol === 'v2' && farm.bCakeWrapperAddress && farm.chainId === chainId,
    ).forEach((farm) => {
      pairTokens.push(farm.token0.sortsBefore(farm.token1) ? [farm.token0, farm.token1] : [farm.token1, farm.token0])
    })
    // from pinned pairs
    if (PINNED_PAIRS[chainId]) {
      PINNED_PAIRS[chainId].forEach((tokens: ITokenPair) => {
        pairTokens.push(tokens)
      })
    }
    // from preset tokens and base tokens
    const baseTokens: Token[] = BASES_TO_TRACK_LIQUIDITY_FOR[chainId]
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

    return uniqWith(
      pairTokens,
      (a: ITokenPair, b: ITokenPair) =>
        (a[0].equals(b[0]) && a[1].equals(b[1])) || (a[0].equals(b[1]) && a[1].equals(b[0])),
    )
  },
  (chainId, presetTokens, userSavedPairs) =>
    `${chainId}:${Object.keys(presetTokens).length}:${Object.values(userSavedPairs).length}`,
)

const V2_UNIVERSAL_FARMS = UNIVERSAL_FARMS.filter((farm) => farm.protocol === Protocol.V2)
const STABLE_UNIVERSAL_FARMS = UNIVERSAL_FARMS.filter((farm) => farm.protocol === Protocol.STABLE)

export const getBCakeWrapperAddress = (lpAddress: Address, chainId: number) => {
  const f = UNIVERSAL_FARMS_MAP[`${chainId}:${lpAddress}`] as V2PoolInfo | StablePoolInfo | undefined

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

  const bCakeWrapperAddresses = validReserveTokens.map((tokens) => {
    const lpAddress = getV2LiquidityToken(tokens).address
    return getBCakeWrapperAddress(lpAddress, chainId)
  })

  const balanceCalls = validLpTokens.map((token) => {
    return {
      abi: erc20Abi,
      address: token.address,
      functionName: 'balanceOf',
      args: [account] as const,
    } as const
  })
  const farmingCalls = bCakeWrapperAddresses.reduce(
    (acc, address) => {
      if (!address || address === '0x') return acc
      return [
        ...acc,
        {
          abi: v2BCakeWrapperABI,
          address,
          functionName: 'userInfo',
          args: [account] as const,
        } as const,
      ]
    },
    [] as Array<{
      abi: typeof v2BCakeWrapperABI
      address: Address
      functionName: 'userInfo'
      args: readonly [Address]
    }>,
  )
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
  const [balances, _farming, reserves, totalSupplies] = await Promise.all([
    client.multicall({
      contracts: balanceCalls,
      allowFailure: true, //
    }),
    client.multicall({
      contracts: farmingCalls,
      allowFailure: true,
    }),
    client.multicall({
      contracts: reserveCalls,
      allowFailure: true,
    }),
    client.multicall({
      contracts: totalSupplyCalls,
      allowFailure: true,
    }),
  ])

  const farming = bCakeWrapperAddresses.reduce((acc, address) => {
    if (!address || address === '0x') return [...acc, undefined]
    const { result } = _farming.shift() ?? { result: undefined }
    return [...acc, result]
  }, [] as Array<readonly [bigint, bigint, bigint, bigint, bigint] | undefined>)

  return balances
    .map((result, index) => {
      const { result: _balance = 0n, status } = result
      // LP not exist
      if (status === 'failure') return undefined

      const nativeBalance = CurrencyAmount.fromRawAmount(validLpTokens[index], _balance)
      const farmingInfo = farming[index]
      let farmingBalance = CurrencyAmount.fromRawAmount(validLpTokens[index], '0')
      let farmingBoosterMultiplier = 0
      let farmingBoostedAmount = CurrencyAmount.fromRawAmount(validLpTokens[index], '0')
      if (farmingInfo) {
        farmingBalance = CurrencyAmount.fromRawAmount(validLpTokens[index], farmingInfo[0].toString())
        farmingBoosterMultiplier = new BigNumber(Number(farmingInfo[2])).div(1000000000000).toNumber()
        farmingBoostedAmount = CurrencyAmount.fromRawAmount(validLpTokens[index], farmingInfo[3].toString())
      }
      const tokens = validReserveTokens[index]
      const [token0, token1] = tokens[0].sortsBefore(tokens[1]) ? tokens : tokens.reverse()
      const [reserve0, reserve1] = reserves[index].result ?? [0n, 0n]
      const pair = new Pair(
        CurrencyAmount.fromRawAmount(token0, reserve0.toString()),
        CurrencyAmount.fromRawAmount(token1, reserve1.toString()),
      )
      const totalSupply = CurrencyAmount.fromRawAmount(
        validLpTokens[index],
        (totalSupplies[index].result ?? 0n).toString(),
      )
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
    .filter((r) => typeof r !== 'undefined') as V2LPDetail[]
}

export const getStablePairDetails = async (
  chainId: number,
  account: Address,
  stablePairs: LegacyStableSwapPair[],
): Promise<StableLPDetail[]> => {
  const client = publicClient({ chainId })
  const validStablePairs = stablePairs.filter((pair) => pair.liquidityToken && pair.liquidityToken.chainId === chainId)

  if (!account || !client || !validStablePairs.length) return []

  const bCakeWrapperAddresses = validStablePairs.reduce((acc, pair) => {
    return [...acc, getBCakeWrapperAddress(pair.lpAddress, chainId)]
  }, [] as Array<Address>)

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
      account,
    } as const
  })
  const farmingCalls = bCakeWrapperAddresses.map((address) => {
    if (address === '0x') {
      return {
        abi: v2BCakeWrapperABI,
        address: zeroAddress,
        functionName: 'userInfo',
        args: [account] as const,
      }
    }
    return {
      abi: v2BCakeWrapperABI,
      address,
      functionName: 'userInfo',
      args: [account] as const,
    } as const
  })

  const [balances, totalSupplies, farming] = await Promise.all([
    client
      .multicall({
        contracts: balanceCalls,
        allowFailure: true,
      })
      .then((res) => res.map((item) => item.result ?? 0n)),
    client
      .multicall({
        contracts: totalSupplyCalls,
        allowFailure: true,
      })
      .then((res) => res.map((item) => item.result ?? 0n)),
    client
      .multicall({
        contracts: farmingCalls,
        allowFailure: true,
      })
      .then((res) => res.map((item) => item.result ?? Array(5).fill(0n))),
  ])

  const nativeCalcCoinsAmountCalls = validStablePairs.map((pair, index) => {
    return {
      abi: infoStableSwapABI,
      address: pair.infoStableSwapAddress,
      functionName: 'calc_coins_amount',
      args: [pair.stableSwapAddress, balances[index]] as const,
    } as const
  })
  const farmingCalcCoinsAmountCalls = validStablePairs.map((pair, index) => {
    return {
      abi: infoStableSwapABI,
      address: pair.infoStableSwapAddress,
      functionName: 'calc_coins_amount',
      args: [pair.stableSwapAddress, farming[index]?.[0]?.toString() ?? '0'] as const,
    } as const
  })

  const [nativeReserveResults, farmingReserveResults] = await Promise.all([
    client
      .multicall({
        contracts: nativeCalcCoinsAmountCalls,
        allowFailure: true,
      })
      .then((res) => res.map((item) => item.result ?? [0n, 0n])),
    client
      .multicall({
        contracts: farmingCalcCoinsAmountCalls,
        allowFailure: true,
      })
      .then((res) => res.map((item) => item.result ?? [0n, 0n])),
  ])

  const result = validStablePairs.map((pair, index) => {
    const nativeBalance = CurrencyAmount.fromRawAmount(pair.liquidityToken, balances[index])
    const farmingInfo = farming[index]
    let farmingBalance = CurrencyAmount.fromRawAmount(pair.liquidityToken, '0')
    let farmingBoosterMultiplier = 0
    let farmingBoostedAmount = CurrencyAmount.fromRawAmount(pair.liquidityToken, '0')
    if (farmingInfo) {
      farmingBalance = CurrencyAmount.fromRawAmount(pair.liquidityToken, farmingInfo[0].toString())
      farmingBoosterMultiplier = new BigNumber(Number(farmingInfo[2])).div(1000000000000).toNumber()
      farmingBoostedAmount = CurrencyAmount.fromRawAmount(pair.liquidityToken, farmingInfo[3].toString())
    }
    const { token0, token1 } = pair
    const totalSupply = CurrencyAmount.fromRawAmount(pair.liquidityToken, totalSupplies[index].toString())

    const [nativeToken0Amount, nativeToken1Amount] = nativeReserveResults[index]
    const nativeDeposited0 = CurrencyAmount.fromRawAmount(token0.wrapped, nativeToken0Amount.toString())
    const nativeDeposited1 = CurrencyAmount.fromRawAmount(token1.wrapped, nativeToken1Amount.toString())

    const [farmingToken0Amount, farmingToken1Amount] = farmingReserveResults[index]
    const farmingDeposited0 = CurrencyAmount.fromRawAmount(token1.wrapped, farmingToken0Amount.toString())
    const farmingDeposited1 = CurrencyAmount.fromRawAmount(token1.wrapped, farmingToken1Amount.toString())

    const isStaked = !!STABLE_UNIVERSAL_FARMS.find((farm) => farm.lpAddress === pair.lpAddress)

    return {
      nativeBalance,
      farmingBalance,
      pair,
      totalSupply,
      nativeDeposited0,
      farmingDeposited0,
      nativeDeposited1,
      farmingDeposited1,
      farmingBoostedAmount,
      farmingBoosterMultiplier,
      isStaked,
      protocol: Protocol.STABLE,
    }
  })
  return result
}
