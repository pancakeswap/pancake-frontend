import { ChainId, Coin, Pair, PAIR_RESERVE_TYPE_TAG } from '@pancakeswap/aptos-swap-sdk'
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
import { usePairReservesQueries } from 'hooks/usePairs'
import fromPairs from 'lodash/fromPairs'
import { useMemo } from 'react'
import { FARMS_ADDRESS, FARMS_NAME_TAG, FARMS_USER_INFO_RESOURCE, FARMS_USER_INFO } from 'state/farms/constants'
import { FarmResource, FarmUserInfoResource } from 'state/farms/types'
import priceHelperLpsMainnet from '../../config/constants/priceHelperLps/farms/1'
import priceHelperLpsTestnet from '../../config/constants/priceHelperLps/farms/2'
import { deserializeFarm } from './utils/deserializeFarm'
import { pendingCake } from './utils/pendingCake'

const farmsPriceHelpLpMap = {
  [ChainId.MAINNET]: priceHelperLpsMainnet,
  [ChainId.TESTNET]: priceHelperLpsTestnet,
}

export const useFarmsLength = (): number | undefined => {
  const { data: farmsLength } = useMasterChefResource((s) => s.data.lp.length)
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
        const tokenBalanceLP = lpReserveX ? new BigNumber(lpReserveX) : BIG_ZERO
        const quoteTokenBalanceLP = lpReserveY ? new BigNumber(lpReserveY) : BIG_ZERO
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

        return {
          ...config,
          tokenAmountTotal: tokenAmountTotal.toFixed(6),
          quoteTokenAmountTotal: quoteTokenAmountTotal.toFixed(6),
          lpTotalSupply: lpTotalSupply.toFixed(6),
          lpTotalInQuoteToken: lpTotalInQuoteToken.toFixed(6),
          tokenPriceVsQuote:
            !quoteTokenAmountTotal.isZero() && !tokenAmountTotal.isZero()
              ? quoteTokenAmountTotal.div(tokenAmountTotal).toFixed(6)
              : '0',
          poolWeight: poolWeight.toString(),
          multiplier: `${allocPoint.div(100).toString()}X`,
        }
      })
  }, [farmConfig, masterChef, pairReserves, stakeCoinsInfoMap])

  const farmsWithPrices = useMemo(() => getFarmsPrices(lpInfo, nativeStableLpMap[chainId]), [chainId, lpInfo])

  useFarmsUserInfo()

  return useMemo(() => {
    return {
      userDataLoaded: true,
      poolLength,
      regularCakePerBlock: masterChef?.data ? Number(masterChef.data.cake_per_second) : 0,
      loadArchivedFarmsData: false,
      data: farmsWithPrices.filter((f) => !!f.pid).map(deserializeFarm),
      fetchUserFarmsData: () => {
        //
      },
    }
  }, [poolLength, masterChef?.data, farmsWithPrices])
}

export function useFarmsUserInfo() {
  const { account } = useAccount()
  const { networkName } = useActiveNetwork()
  const { data } = useAccountResource<FetchAccountResourceResult<FarmUserInfoResource>>({
    address: account?.address,
    resourceType: FARMS_USER_INFO_RESOURCE,
  })

  useQueries({
    queries:
      data?.data.pids.map((pid) => ({
        staleTime: Infinity,
        enable: Boolean(pid) && Boolean(account?.address) && Boolean(data.data.pid_to_user_info.inner.handle),
        refetchInterval: 5_000,
        queryKey: [{ entity: 'poolUserInfo', pid, networkName, address: account?.address }],
        queryFn: () =>
          fetchTableItem({
            networkName,
            handle: data.data.pid_to_user_info.inner.handle,
            data: {
              keyType: 'u64',
              key: pid,
              valueType: FARMS_USER_INFO,
            },
          }),
      })) ?? [],
  })
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
  // eslint-disable-next-line camelcase
  return useQuery<{ amount: string; reward_debt: string }>(
    [{ entity: 'poolUserInfo', pid, networkName, address: account?.address }],
    {
      enabled: Boolean(account?.address),
    },
  )
}

export function useFarmEarning(pid: string) {
  const { data: masterChef } = useMasterChefResource()

  const { data: userInfo } = useFarmUserInfoCache(String(pid))

  return useMemo(
    () =>
      masterChef?.data.pool_info[pid].acc_cake_per_share && userInfo && userInfo.amount !== '0'
        ? pendingCake(
            userInfo.amount,
            userInfo.reward_debt,
            masterChef?.data.pool_info[pid].acc_cake_per_share,
          ).toNumber()
        : 0,
    [masterChef?.data.pool_info, pid, userInfo],
  )
}
