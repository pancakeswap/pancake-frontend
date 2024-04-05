import { DeserializedFarmsState, DeserializedFarmUserData, supportedChainIdV2 } from '@pancakeswap/farms'
import { getFarmConfig } from '@pancakeswap/farms/constants'
import { useQuery } from '@tanstack/react-query'
import { SLOW_INTERVAL } from 'config/constants'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import { getMasterChefContract } from 'utils/contractHelpers'
import { useBCakeProxyContractAddress } from 'views/Farms/hooks/useBCakeProxyContractAddress'

import useAccountActiveChain from 'hooks/useAccountActiveChain'
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

export function useFarmsLength() {
  const { chainId } = useActiveChainId()
  return useQuery({
    queryKey: ['farmsLength', chainId],

    queryFn: async () => {
      const mc = getMasterChefContract(undefined, chainId)
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
      dispatch(fetchFarmUserDataAsync(params))
      dispatch(fetchBCakeWrapperUserDataAsync(bCakeParams))
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
