import {
  DeserializedFarmsState,
  DeserializedFarmUserData,
  getLegacyFarmConfig,
  supportedChainIdV2,
} from '@pancakeswap/farms'
import { useQuery } from '@tanstack/react-query'
import { SLOW_INTERVAL } from 'config/constants'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useBCakeProxyContractAddress } from 'hooks/useBCakeProxyContractAddress'
import { fetchV3FarmsAvgInfo } from 'queries/farms'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import { getMasterChefContract } from 'utils/contractHelpers'

import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { V2FarmWithoutStakedValue, V3FarmWithoutStakedValue } from 'state/farms/types'
import {
  fetchBCakeWrapperDataAsync,
  fetchBCakeWrapperUserDataAsync,
  fetchFarmsPublicDataAsync,
  fetchFarmUserDataAsync,
} from '.'
import {
  farmSelector,
  makeFarmFromPidSelector,
  makeLpTokenPriceFromLpSymbolSelector,
  makeUserFarmFromPidSelector,
} from './selectors'

export function useFarmsLength({ enabled = true } = {}) {
  const { chainId } = useActiveChainId()
  return useQuery({
    queryKey: ['farmsLength', chainId],

    queryFn: async () => {
      const mc = getMasterChefContract(undefined, chainId)
      if (!mc) {
        const farmsConfig = await getLegacyFarmConfig(chainId)
        const maxPid = farmsConfig?.length ? Math.max(...farmsConfig?.map((farm) => farm.pid)) : undefined
        return maxPid ? maxPid + 1 : 0
      }
      return Number(await mc.read.poolLength())
    },

    enabled: Boolean(enabled && chainId && supportedChainIdV2.includes(chainId)),
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  })
}

export function useFarmV2PublicAPI() {
  const { chainId } = useActiveChainId()
  return useQuery({
    queryKey: ['farm-v2-pubic-api', chainId],

    queryFn: async () => {
      return fetch(`https://farms-api.pancakeswap.com/${chainId}`)
        .then((res) => res.json())
        .then((res) => res.data)
    },

    enabled: Boolean(chainId && supportedChainIdV2.includes(chainId)),
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  })
}

export const usePollFarmsAvgInfo = (activeFarms: (V3FarmWithoutStakedValue | V2FarmWithoutStakedValue)[]) => {
  const { chainId } = useAccountActiveChain()

  const activeFarmAddresses = useMemo(() => {
    return activeFarms.map((farm) => farm.lpAddress).sort()
  }, [activeFarms])

  const { data } = useQuery({
    queryKey: ['farmsAvgInfo', chainId, activeFarmAddresses],
    placeholderData: (prev) => {
      if (!prev) {
        return {}
      }
      return prev
    },
    queryFn: async () => {
      if (!chainId) return undefined

      const addresses = activeFarms.map((farm) => farm.lpAddress?.toLowerCase())

      const farmAvgInfo = await fetchV3FarmsAvgInfo(chainId)

      const info: { [key: string]: { volumeUSD: number; tvlUSD: number; feeUSD: number; apr: number } } = {}
      for (const addr of addresses) {
        const farmInfo = farmAvgInfo[addr]
        info[addr] = {
          volumeUSD: farmInfo?.volumeUSD7d.div(7).decimalPlaces(2).toNumber(),
          tvlUSD: 0,
          feeUSD: 0,
          apr: farmInfo?.apr7d.times(100).decimalPlaces(5).toNumber(),
        }
      }
      return info
    },

    enabled: Boolean(chainId && activeFarms?.length),
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  })

  return data
}

export const usePollFarmsWithUserData = () => {
  const dispatch = useAppDispatch()
  const { account, chainId } = useAccountActiveChain()
  const {
    proxyAddress,
    proxyCreated,
    isLoading: isProxyContractLoading,
  } = useBCakeProxyContractAddress(account, chainId)

  useQuery({
    queryKey: ['publicFarmData', chainId],

    queryFn: async () => {
      if (!chainId) {
        throw new Error('ChainId is not defined')
      }
      const farmsConfig = await getLegacyFarmConfig(chainId)

      if (!farmsConfig) {
        throw new Error('Failed to fetch farm config')
      }
      const pids = farmsConfig.map((farmToFetch) => farmToFetch.pid)
      const bCakePids = farmsConfig.filter((d) => Boolean(d.bCakeWrapperAddress)).map((farmToFetch) => farmToFetch.pid)
      dispatch(fetchBCakeWrapperDataAsync({ pids: bCakePids, chainId }))
      dispatch(fetchFarmsPublicDataAsync({ pids, chainId }))
      return null
    },

    enabled: Boolean(chainId && supportedChainIdV2.includes(chainId)),
    refetchInterval: SLOW_INTERVAL,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  })

  const name = proxyCreated
    ? ['farmsWithUserData', account, proxyAddress, chainId]
    : ['farmsWithUserData', account, chainId]

  useQuery({
    queryKey: name,

    queryFn: async () => {
      const farmsConfig = await getLegacyFarmConfig(chainId)

      if (!chainId || !farmsConfig || !account) return
      const pids = farmsConfig.map((farmToFetch) => farmToFetch.pid)
      const params = proxyCreated ? { account, pids, proxyAddress, chainId } : { account, pids, chainId }
      const bCakePids = farmsConfig.filter((d) => Boolean(d.bCakeWrapperAddress)).map((farmToFetch) => farmToFetch.pid)
      const bCakeParams = { account, pids: bCakePids, chainId }
      dispatch(fetchBCakeWrapperUserDataAsync(bCakeParams))
      dispatch(fetchFarmUserDataAsync(params))
    },
    enabled: Boolean(account && chainId && !isProxyContractLoading),
    refetchInterval: SLOW_INTERVAL,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  })
}

export const useFarms = (): DeserializedFarmsState => {
  const { chainId } = useActiveChainId()
  return useSelector(useMemo(() => farmSelector(chainId), [chainId]))
}

export const useFarmFromPid = (pid?: number) => {
  const farmFromPid = useMemo(() => makeFarmFromPidSelector(pid), [pid])
  return useSelector(farmFromPid)
}

export const useFarmUser = (pid): DeserializedFarmUserData => {
  const farmFromPidUser = useMemo(() => makeUserFarmFromPidSelector(pid), [pid])
  return useSelector(farmFromPidUser)
}

export const useLpTokenPrice = (symbol: string) => {
  const lpTokenPriceFromLpSymbol = useMemo(() => makeLpTokenPriceFromLpSymbolSelector(symbol), [symbol])
  return useSelector(lpTokenPriceFromLpSymbol)
}
