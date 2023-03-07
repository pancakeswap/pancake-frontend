/* eslint-disable camelcase */
import { ChainId, Coin, Pair, PAIR_RESERVE_TYPE_TAG } from '@pancakeswap/aptos-swap-sdk'
import { DeserializedFarmsState, deserializeFarm } from '@pancakeswap/farms'
import { useAccount, useAccountResource, useCoins, useQueries, useQuery } from '@pancakeswap/awgmi'
import {
  FetchCoinResult,
  unwrapTypeArgFromString,
  fetchTableItem,
  FetchAccountResourceResult,
} from '@pancakeswap/awgmi/core'
import { getFarmsPrices } from '@pancakeswap/farms/farmPrices'
import { BIG_TWO, BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { getFullDecimalMultiplier } from '@pancakeswap/utils/getFullDecimalMultiplier'
import BigNumber from 'bignumber.js'
import { APT, L0_USDC } from 'config/coins'
import { CAKE_PID } from 'config/constants'
import { getFarmConfig } from 'config/constants/farms'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useActiveNetwork } from 'hooks/useNetwork'
import useLedgerTimestamp from 'hooks/useLedgerTimestamp'
import { usePairReservesQueries } from 'hooks/usePairs'
import fromPairs from 'lodash/fromPairs'
import { useMemo } from 'react'
import { FARMS_ADDRESS, FARMS_NAME_TAG, FARMS_USER_INFO_RESOURCE, FARMS_USER_INFO } from 'state/farms/constants'
import { FarmResource, FarmUserInfoResource } from 'state/farms/types'
import { FARM_DEFAULT_DECIMALS } from 'components/Farms/constants'
import priceHelperLpsMainnet from '../../config/constants/priceHelperLps/farms/1'
import priceHelperLpsTestnet from '../../config/constants/priceHelperLps/farms/2'
import { calcPendingRewardCake, calcRewardCakePerShare } from './utils/pendingCake'

const farmsPriceHelpLpMap = {
  [ChainId.MAINNET]: priceHelperLpsMainnet,
  [ChainId.TESTNET]: priceHelperLpsTestnet,
}

export const useFarmsLength = (): number | undefined => {
  const { data: farmsLength } = useMasterChefResource((s) => s.data.lps.length)
  return farmsLength
}

export function useMasterChefResource<TData = FarmResource>(select?: ((data: FarmResource) => TData) | undefined) {
  const { networkName } = useActiveNetwork()
  return useAccountResource<TData>({
    watch: true,
    networkName,
    address: FARMS_ADDRESS,
    resourceType: FARMS_NAME_TAG,
    // @ts-ignore
    select,
  })
}

export const useFarms = () => {
  const { chainId } = useActiveWeb3React()
  const poolLength = useFarmsLength()
  const { networkName } = useActiveNetwork()

  const { data: masterChef } = useMasterChefResource()

  const farmConfig = useMemo(() => getFarmConfig(chainId).concat(farmsPriceHelpLpMap[chainId]), [chainId])
  const farmAddresses = useMemo(() => farmConfig.map((f) => f.lpAddress), [farmConfig])
  const lpReservesAddresses = useMemo(
    () =>
      farmAddresses
        .map((a) => (unwrapTypeArgFromString(a) ? `${PAIR_RESERVE_TYPE_TAG}<${unwrapTypeArgFromString(a)}>` : null))
        .filter(Boolean) as string[],
    [farmAddresses],
  )

  const stakeCoinsInfo = useCoins({
    coins: farmAddresses,
    networkName,
    staleTime: 10_000,
  })

  const stakeCoinsInfoMap = useMemo(() => {
    return fromPairs(
      stakeCoinsInfo.filter((c) => c.data).map((c) => [c.data?.address, c.data] as [string, FetchCoinResult]),
    )
  }, [stakeCoinsInfo])

  const pairReserves = usePairReservesQueries(lpReservesAddresses)
  const lpInfo = useMemo(() => {
    return farmConfig
      .filter((f) => f.pid !== 0 && f.pid !== CAKE_PID)
      .concat()
      .map((config) => {
        const token = new Coin(config.token.chainId, config.token.address, config.token.decimals, config.token.symbol)
        const quoteToken = new Coin(
          config.quoteToken.chainId,
          config.quoteToken.address,
          config.quoteToken.decimals,
          config.quoteToken.symbol,
        )
        const reservesAddress = Pair.getReservesAddress(token, quoteToken)
        const lpReserveX = pairReserves?.[reservesAddress]?.data.reserve_x
        const lpReserveY = pairReserves?.[reservesAddress]?.data.reserve_y
        const tokenBalanceLP = lpReserveY ? new BigNumber(lpReserveY) : BIG_ZERO
        const quoteTokenBalanceLP = lpReserveX ? new BigNumber(lpReserveX) : BIG_ZERO
        const lpTotalSupply = stakeCoinsInfoMap[config.lpAddress]?.supply
          ? new BigNumber(stakeCoinsInfoMap[config.lpAddress].supply as string)
          : BIG_ZERO

        const poolInfo = masterChef && masterChef.data.pool_info[config.pid]

        const lpTokenRatio =
          poolInfo && !lpTotalSupply.isZero()
            ? new BigNumber(poolInfo.total_amount).div(new BigNumber(lpTotalSupply))
            : BIG_ZERO
        const tokenAmountTotal = new BigNumber(tokenBalanceLP).div(getFullDecimalMultiplier(token.decimals))
        const quoteTokenAmountTotal = new BigNumber(quoteTokenBalanceLP).div(
          getFullDecimalMultiplier(quoteToken.decimals),
        )

        const quoteTokenAmountMc = quoteTokenAmountTotal.times(lpTokenRatio)
        const lpTotalInQuoteToken = quoteTokenAmountMc.times(BIG_TWO)

        const allocPoint = poolInfo ? new BigNumber(poolInfo.alloc_point) : BIG_ZERO
        const totalAlloc = poolInfo?.is_regular
          ? masterChef?.data.total_regular_alloc_point
          : masterChef?.data.total_special_alloc_point
        const poolWeight = totalAlloc ? allocPoint.div(new BigNumber(totalAlloc)) : BIG_ZERO

        // tokenPriceVsQuote info for this price helper farm is wrong, opposite way should be used
        const isAptCakeLp = config.pid === null && config.lpSymbol === 'APT-CAKE LP'

        return {
          ...config,
          tokenAmountTotal: tokenAmountTotal.toFixed(6),
          quoteTokenAmountTotal: quoteTokenAmountTotal.toFixed(6),
          lpTotalSupply: lpTotalSupply.toFixed(6),
          lpTotalInQuoteToken: lpTotalInQuoteToken.toFixed(6),
          tokenPriceVsQuote:
            !quoteTokenAmountTotal.isZero() && !tokenAmountTotal.isZero()
              ? isAptCakeLp
                ? tokenAmountTotal.div(quoteTokenAmountTotal).toFixed(6)
                : quoteTokenAmountTotal.div(tokenAmountTotal).toFixed(6)
              : '0',
          poolWeight: poolWeight.toString(),
          multiplier: `${allocPoint.div(100).toString()}X`,
        }
      })
  }, [farmConfig, masterChef, pairReserves, stakeCoinsInfoMap])

  const farmsWithPrices = useMemo(
    () => getFarmsPrices(lpInfo, nativeStableLpMap[chainId], FARM_DEFAULT_DECIMALS),
    [chainId, lpInfo],
  )

  const userInfos = useFarmsUserInfo()
  const getNow = useLedgerTimestamp()
  const currentDate = getNow() / 1000
  const showCakePerSecond = masterChef?.data && new BigNumber(currentDate).lte(masterChef.data.end_timestamp)
  const regularCakePerSeconds = showCakePerSecond
    ? new BigNumber(masterChef?.data?.cake_per_second)
        .times(masterChef.data.cake_rate_to_regular)
        .div(new BigNumber(masterChef.data.cake_rate_to_regular).plus(masterChef.data.cake_rate_to_special))
        .toNumber()
    : 0

  return useMemo(() => {
    return {
      userDataLoaded: true,
      poolLength,
      regularCakePerBlock: regularCakePerSeconds,
      loadArchivedFarmsData: false,
      data: farmsWithPrices
        .filter((f) => !!f.pid)
        .map(deserializeFarm)
        .map((f) => {
          const accCakePerShare =
            masterChef?.data && f.pid ? calcRewardCakePerShare(masterChef.data, String(f.pid), getNow) : 0
          const earningToken = calcPendingRewardCake(
            userInfos[f.pid]?.amount,
            userInfos[f.pid]?.reward_debt,
            accCakePerShare,
          )
          const stakedBalance = new BigNumber(userInfos[f.pid]?.amount)
          return {
            ...f,
            userData: {
              earnings: earningToken.gte(0) ? earningToken : BIG_ZERO,
              stakedBalance: stakedBalance.gte(0) ? stakedBalance : BIG_ZERO,
            },
          }
        }),
    } as DeserializedFarmsState
  }, [poolLength, regularCakePerSeconds, farmsWithPrices, masterChef, userInfos, getNow])
}

export function useFarmsUserInfo() {
  const { account } = useAccount()
  const { networkName } = useActiveNetwork()
  const { data } = useAccountResource<FetchAccountResourceResult<FarmUserInfoResource>>({
    address: account?.address,
    resourceType: FARMS_USER_INFO_RESOURCE,
    watch: true,
  })

  const userInfoQueries = useQueries({
    queries:
      data?.data.pids.map((pid) => ({
        staleTime: Infinity,
        enable: Boolean(pid) && Boolean(account?.address) && Boolean(data.data.pid_to_user_info.inner.handle),
        refetchInterval: 3_000,
        queryKey: [{ entity: 'poolUserInfo', pid, networkName, address: account?.address }],
        queryFn: async () => {
          const item = await fetchTableItem({
            networkName,
            handle: data.data.pid_to_user_info.inner.handle,
            data: {
              keyType: 'u64',
              key: pid,
              valueType: FARMS_USER_INFO,
            },
          })
          return { ...item, pid }
        },
      })) ?? [],
  })

  const userInfos = useMemo(() => {
    return fromPairs(userInfoQueries.filter((u) => !!u.data).map((u) => [(u as any).data.pid, u.data]))
  }, [userInfoQueries])

  return userInfos
}

const nativeStableLpMap = {
  [ChainId.MAINNET]: {
    address: Pair.getAddress(APT[ChainId.MAINNET], L0_USDC[ChainId.MAINNET]),
    wNative: 'APT',
    stable: 'USDC',
  },
  [ChainId.TESTNET]: {
    address: Pair.getAddress(APT[ChainId.TESTNET], L0_USDC[ChainId.TESTNET]),
    wNative: 'APT',
    stable: 'USDC',
  },
}

// get from cache
export function useFarmUserInfoCache(pid: string) {
  const { account } = useAccount()
  const { networkName } = useActiveNetwork()
  return useQuery<{ amount: string; reward_debt: string }>(
    [{ entity: 'poolUserInfo', pid, networkName, address: account?.address }],
    {
      enabled: Boolean(account?.address),
    },
  )
}
