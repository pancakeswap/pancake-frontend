import BigNumber from 'bignumber.js'
import { SLOW_INTERVAL } from 'config/constants'
import { useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import useSWRImmutable from 'swr/immutable'
import { useBCakeProxyContractAddress } from 'views/Farms/hooks/useBCakeProxyContractAddress'
import { getMasterChefContract } from 'utils/contractHelpers'
import { useFastRefreshEffect } from 'hooks/useRefreshEffect'
import { getFarmConfig } from '@pancakeswap/farms/constants'
import { DeserializedFarm, DeserializedFarmsState, DeserializedFarmUserData } from '@pancakeswap/farms'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useCakePriceAsBN } from '@pancakeswap/utils/useCakePrice'

import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { fetchFarmsPublicDataAsync, fetchFarmUserDataAsync, fetchInitialFarmsData } from '.'
import { State } from '../types'
import {
  farmFromLpSymbolSelector,
  farmSelector,
  makeBusdPriceFromPidSelector,
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

/**
 * Fetches the "core" farm data used globally
 * 2 = CAKE-BNB LP
 * 3 = BUSD-BNB LP
 */
const coreFarmPIDs = {
  56: [2, 3],
  97: [4, 10],
  5: [13, 11],
  1: [124, 125],
}

export const usePollCoreFarmData = () => {
  const dispatch = useAppDispatch()
  const { chainId } = useActiveChainId()

  useEffect(() => {
    if (chainId) {
      dispatch(fetchInitialFarmsData({ chainId }))
    }
  }, [chainId, dispatch])

  useFastRefreshEffect(() => {
    if (chainId) {
      dispatch(fetchFarmsPublicDataAsync({ pids: coreFarmPIDs[chainId], chainId }))
    }
  }, [dispatch, chainId])
}

export const useFarms = (): DeserializedFarmsState => {
  const { chainId } = useActiveChainId()
  return useSelector(useMemo(() => farmSelector(chainId), [chainId]))
}

export const useFarmsPoolLength = (): number => {
  return useSelector((state: State) => state.farms.poolLength)
}

export const useFarmFromPid = (pid: number): DeserializedFarm => {
  const farmFromPid = useMemo(() => makeFarmFromPidSelector(pid), [pid])
  return useSelector(farmFromPid)
}

export const useFarmFromLpSymbol = (lpSymbol: string): DeserializedFarm => {
  const farmFromLpSymbol = useMemo(() => farmFromLpSymbolSelector(lpSymbol), [lpSymbol])
  return useSelector(farmFromLpSymbol)
}

export const useFarmUser = (pid): DeserializedFarmUserData => {
  const farmFromPidUser = useMemo(() => makeUserFarmFromPidSelector(pid), [pid])
  return useSelector(farmFromPidUser)
}

// Return the base token price for a farm, from a given pid
export const useBusdPriceFromPid = (pid: number): BigNumber => {
  const busdPriceFromPid = useMemo(() => makeBusdPriceFromPidSelector(pid), [pid])
  return useSelector(busdPriceFromPid)
}

export const useLpTokenPrice = (symbol: string) => {
  const lpTokenPriceFromLpSymbol = useMemo(() => makeLpTokenPriceFromLpSymbolSelector(symbol), [symbol])
  return useSelector(lpTokenPriceFromLpSymbol)
}

export const usePriceCakeUSD = (): BigNumber => {
  return useCakePriceAsBN()
}
