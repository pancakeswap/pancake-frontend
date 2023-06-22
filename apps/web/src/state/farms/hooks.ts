import BigNumber from 'bignumber.js'
import { SLOW_INTERVAL } from 'config/constants'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import useSWRImmutable from 'swr/immutable'
import { useBCakeProxyContractAddress } from 'views/Farms/hooks/useBCakeProxyContractAddress'
import { getMasterChefContract } from 'utils/contractHelpers'
import { getFarmConfig } from '@pancakeswap/farms/constants'
import { DeserializedFarm, DeserializedFarmsState, DeserializedFarmUserData } from '@pancakeswap/farms'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useCakePriceAsBN } from '@pancakeswap/utils/useCakePrice'

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
  return useSWRImmutable(chainId ? ['farmsLength', chainId] : null, async () => {
    const mc = getMasterChefContract(undefined, chainId)
    return Number(await mc.read.poolLength())
  })
}

export function useFarmV2PublicAPI() {
  const { chainId } = useActiveChainId()
  return useSWRImmutable(chainId ? ['farm-v2-pubic-api', chainId] : null, async () => {
    return fetch(`https://farms-api.pancakeswap.com/${chainId}`)
      .then((res) => res.json())
      .then((res) => res.data)
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

  useSWRImmutable(
    chainId ? ['publicFarmData', chainId] : null,
    async () => {
      const farmsConfig = (await getFarmConfig(chainId)) || []
      const pids = farmsConfig.map((farmToFetch) => farmToFetch.pid)

      dispatch(fetchFarmsPublicDataAsync({ pids, chainId }))
    },
    {
      refreshInterval: SLOW_INTERVAL,
    },
  )

  const name = proxyCreated
    ? ['farmsWithUserData', account, proxyAddress, chainId]
    : ['farmsWithUserData', account, chainId]

  useSWRImmutable(
    account && chainId && !isProxyContractLoading ? name : null,
    async () => {
      const farmsConfig = (await getFarmConfig(chainId)) || []
      const pids = farmsConfig.map((farmToFetch) => farmToFetch.pid)
      const params = proxyCreated ? { account, pids, proxyAddress, chainId } : { account, pids, chainId }
      dispatch(fetchFarmUserDataAsync(params))
    },
    {
      refreshInterval: SLOW_INTERVAL,
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

export const usePriceCakeUSD = (): BigNumber => {
  return useCakePriceAsBN()
}
