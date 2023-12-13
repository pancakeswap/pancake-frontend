import { SLOW_INTERVAL } from 'config/constants'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import { useQuery } from '@tanstack/react-query'
import { useBCakeProxyContractAddress } from 'views/Farms/hooks/useBCakeProxyContractAddress'
import { getMasterChefContract } from 'utils/contractHelpers'
import { getFarmConfig } from '@pancakeswap/farms/constants'
import {
  DeserializedFarm,
  DeserializedFarmsState,
  DeserializedFarmUserData,
  supportedChainIdV2,
} from '@pancakeswap/farms'
import { useActiveChainId } from 'hooks/useActiveChainId'

import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { fetchFarmsPublicDataAsync, fetchFarmUserDataAsync } from '.'
import {
  farmSelector,
  makeFarmFromPidSelector,
  makeLpTokenPriceFromLpSymbolSelector,
  makeUserFarmFromPidSelector,
} from './selectors'

export function useFarmsLength() {
  const { chainId } = useActiveChainId()
  return useQuery(
    ['farmsLength', chainId],
    async () => {
      const mc = getMasterChefContract(undefined, chainId)
      return Number(await mc.read.poolLength())
    },
    {
      enabled: Boolean(chainId && supportedChainIdV2.includes(chainId)),
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  )
}

export function useFarmV2PublicAPI() {
  const { chainId } = useActiveChainId()
  return useQuery(
    ['farm-v2-pubic-api', chainId],
    async () => {
      return fetch(`https://farms-api.pancakeswap.com/${chainId}`)
        .then((res) => res.json())
        .then((res) => res.data)
    },
    {
      enabled: Boolean(chainId && supportedChainIdV2.includes(chainId)),
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  )
}

export const usePollFarmsWithUserData = () => {
  const dispatch = useAppDispatch()
  const { account, chainId } = useAccountActiveChain()
  const {
    proxyAddress,
    proxyCreated,
    isLoading: isProxyContractLoading,
  } = useBCakeProxyContractAddress(account, chainId)

  useQuery(
    ['publicFarmData', chainId],
    async () => {
      const farmsConfig = await getFarmConfig(chainId)
      if (!farmsConfig) return
      const pids = farmsConfig.map((farmToFetch) => farmToFetch.pid)

      dispatch(fetchFarmsPublicDataAsync({ pids, chainId }))
    },
    {
      enabled: Boolean(chainId && supportedChainIdV2.includes(chainId)),
      refetchInterval: SLOW_INTERVAL,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  )

  const name = proxyCreated
    ? ['farmsWithUserData', account, proxyAddress, chainId]
    : ['farmsWithUserData', account, chainId]

  useQuery(
    name,
    async () => {
      const farmsConfig = await getFarmConfig(chainId)
      if (!farmsConfig) return
      const pids = farmsConfig.map((farmToFetch) => farmToFetch.pid)
      const params = proxyCreated ? { account, pids, proxyAddress, chainId } : { account, pids, chainId }
      dispatch(fetchFarmUserDataAsync(params))
    },
    {
      enabled: Boolean(account && chainId && !isProxyContractLoading),
      refetchInterval: SLOW_INTERVAL,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  )
}

export const useFarms = (): DeserializedFarmsState => {
  const { chainId } = useActiveChainId()
  return useSelector(useMemo(() => farmSelector(chainId), [chainId]))
}

export const useFarmFromPid = (pid: number): DeserializedFarm => {
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
