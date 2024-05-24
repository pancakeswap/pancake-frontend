import { DeserializedFarmsState, DeserializedFarmUserData, supportedChainIdV2 } from '@pancakeswap/farms'
import { getFarmConfig } from '@pancakeswap/farms/constants'
import { useQuery } from '@tanstack/react-query'
import { SLOW_INTERVAL } from 'config/constants'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import { getMasterChefContract } from 'utils/contractHelpers'
import { useBCakeProxyContractAddress } from 'views/Farms/hooks/useBCakeProxyContractAddress'

import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { V2FarmWithoutStakedValue, V3FarmWithoutStakedValue } from 'views/Farms/FarmsV3'
import { v3Clients } from 'utils/graphql'
import { gql } from 'graphql-request'
import { averageArray } from 'hooks/usePoolAvgInfo'
import { multiQuery } from 'views/Info/utils/infoQueryHelpers'
import mapKeys from 'lodash/mapKeys'
import mapValues from 'lodash/mapValues'
import { usePreviousValue } from '@pancakeswap/hooks'
import {
  farmSelector,
  makeFarmFromPidSelector,
  makeLpTokenPriceFromLpSymbolSelector,
  makeUserFarmFromPidSelector,
} from './selectors'
import {
  fetchBCakeWrapperDataAsync,
  fetchBCakeWrapperUserDataAsync,
  fetchFarmsPublicDataAsync,
  fetchFarmUserDataAsync,
} from '.'

export function useFarmsLength() {
  const { chainId } = useActiveChainId()
  return useQuery({
    queryKey: ['farmsLength', chainId],

    queryFn: async () => {
      const mc = getMasterChefContract(undefined, chainId)
      if (!mc) {
        const farmsConfig = await getFarmConfig(chainId)
        const maxPid = farmsConfig?.length ? Math.max(...farmsConfig?.map((farm) => farm.pid)) : undefined
        return maxPid ? maxPid + 1 : 0
      }
      return Number(await mc.read.poolLength())
    },

    enabled: Boolean(chainId && supportedChainIdV2.includes(chainId)),
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
  const prevActiveFarms = usePreviousValue(activeFarms)

  const { refetch } = useQuery({
    queryKey: ['farmsAvgInfo', chainId],

    queryFn: async () => {
      if (!chainId) return undefined
      const client = v3Clients[chainId]
      if (!client) {
        console.error('[Failed] Trading volume', chainId)
        return {
          volumeUSD: 0,
          tvlUSD: 0,
          feeUSD: 0,
        }
      }

      const addresses = activeFarms
        .map((farm) => farm.lpAddress)
        .map((lpAddress) => {
          return lpAddress.toLowerCase()
        })

      const rawResult: any | undefined = await multiQuery(
        (subqueries) => gql`
      query getVolume {
        ${subqueries}
      }
    `,
        addresses.map(
          (tokenAddress) => `
          t${tokenAddress}:poolDayDatas(first: 7, orderBy: date, orderDirection: desc, where: { pool: "${tokenAddress.toLowerCase()}"}) {
            volumeUSD
            tvlUSD
            feesUSD
            protocolFeesUSD
          }
    `,
        ),
        client,
      )

      const results = mapKeys(rawResult, (_, key) => {
        return key.substring(1, key.length)
      })

      return mapValues(results, (value) => {
        const volumes = value.map((d: { volumeUSD: string }) => Number(d.volumeUSD))
        const feeUSDs = value.map(
          (d: { feesUSD: string; protocolFeesUSD: string }) => Number(d.feesUSD) - Number(d.protocolFeesUSD),
        )
        return {
          volumeUSD: averageArray(volumes),
          tvlUSD: parseFloat(value[0]?.tvlUSD) || 0,
          feeUSD: averageArray(feeUSDs),
        }
      })
    },

    enabled: Boolean(chainId && activeFarms),
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  })

  useEffect(() => {
    if (activeFarms) {
      if (prevActiveFarms) {
        const prevLpAddresses = prevActiveFarms.map((farm) => farm.lpAddress)
        const hasDifferentAddresses = activeFarms
          .map((farm) => farm.lpAddress)
          .some((address) => !prevLpAddresses.includes(address))
        if (hasDifferentAddresses) {
          refetch()
        }
      } else {
        refetch()
      }
    }
  }, [refetch, activeFarms, prevActiveFarms])
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
      const farmsConfig = await getFarmConfig(chainId)

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
      const farmsConfig = await getFarmConfig(chainId)

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
