import { useEffect, useMemo } from 'react'
import { useAccount } from 'wagmi'
import { batch, useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import { useFastRefreshEffect, useSlowRefreshEffect } from 'hooks/useRefreshEffect'
import { FAST_INTERVAL } from 'config/constants'
import useSWRImmutable from 'swr/immutable'
import { getFarmConfig } from '@pancakeswap/farms/constants'
import { Pool } from '@pancakeswap/uikit'
import { Token } from '@pancakeswap/sdk'
import { getLivePoolsConfig } from '@pancakeswap/pools'

import { useActiveChainId } from 'hooks/useActiveChainId'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import {
  fetchPoolsPublicDataAsync,
  fetchPoolsUserDataAsync,
  fetchCakeVaultPublicData,
  fetchCakeVaultUserData,
  fetchCakeVaultFees,
  fetchPoolsStakingLimitsAsync,
  fetchUserIfoCreditDataAsync,
  fetchIfoPublicDataAsync,
  fetchCakeFlexibleSideVaultPublicData,
  fetchCakeFlexibleSideVaultUserData,
  fetchCakeFlexibleSideVaultFees,
  fetchCakePoolUserDataAsync,
  fetchCakePoolPublicDataAsync,
  setInitialPoolConfig,
} from '.'
import { VaultKey } from '../types'
import { fetchFarmsPublicDataAsync } from '../farms'
import {
  makePoolWithUserDataLoadingSelector,
  makeVaultPoolByKey,
  poolsWithVaultSelector,
  ifoCreditSelector,
  ifoCeilingSelector,
  makeVaultPoolWithKeySelector,
} from './selectors'

// Only fetch farms for live pools
const getActiveFarms = async (chainId: number) => {
  const farmsConfig = (await getFarmConfig(chainId)) || []
  const livePools = getLivePoolsConfig(chainId) || []
  const lPoolAddresses = livePools
    .filter(({ sousId }) => sousId !== 0)
    .map(({ earningToken, stakingToken }) => {
      if (earningToken.symbol === 'CAKE') {
        return stakingToken.address
      }
      return earningToken.address
    })

  return farmsConfig
    .filter(
      ({ token, pid, quoteToken }) =>
        pid !== 0 &&
        ((token.symbol === 'CAKE' && quoteToken.symbol === 'WBNB') ||
          (token.symbol === 'BUSD' && quoteToken.symbol === 'WBNB') ||
          (token.symbol === 'USDT' && quoteToken.symbol === 'BUSD') ||
          lPoolAddresses.find((poolAddress) => poolAddress === token.address)),
    )
    .map((farm) => farm.pid)
}

const getCakePriceFarms = async (chainId: number) => {
  const farmsConfig = (await getFarmConfig(chainId)) || []
  return farmsConfig
    .filter(
      ({ token, pid, quoteToken }) =>
        pid !== 0 &&
        ((token.symbol === 'CAKE' && quoteToken.symbol === 'WBNB') ||
          (token.symbol === 'BUSD' && quoteToken.symbol === 'WBNB')),
    )
    .map((farm) => farm.pid)
}

export const useFetchPublicPoolsData = () => {
  const dispatch = useAppDispatch()
  const { chainId } = useActiveChainId()

  useSlowRefreshEffect(() => {
    const fetchPoolsDataWithFarms = async () => {
      const activeFarms = await getActiveFarms(chainId)
      await dispatch(fetchFarmsPublicDataAsync({ pids: activeFarms, chainId }))

      batch(() => {
        dispatch(fetchPoolsPublicDataAsync(chainId))
        dispatch(fetchPoolsStakingLimitsAsync(chainId))
      })
    }

    fetchPoolsDataWithFarms()
  }, [dispatch, chainId])
}

export const usePool = (sousId: number): { pool: Pool.DeserializedPool<Token>; userDataLoaded: boolean } => {
  const poolWithUserDataLoadingSelector = useMemo(() => makePoolWithUserDataLoadingSelector(sousId), [sousId])
  return useSelector(poolWithUserDataLoadingSelector)
}

export const usePoolsWithVault = () => {
  return useSelector(poolsWithVaultSelector)
}

export const useDeserializedPoolByVaultKey = (vaultKey) => {
  const vaultPoolWithKeySelector = useMemo(() => makeVaultPoolWithKeySelector(vaultKey), [vaultKey])

  return useSelector(vaultPoolWithKeySelector)
}

export const usePoolsConfigInitialize = () => {
  const dispatch = useAppDispatch()
  const { chainId } = useActiveChainId()
  useEffect(() => {
    if (chainId) {
      dispatch(setInitialPoolConfig({ chainId }))
    }
  }, [dispatch, chainId])
}

export const usePoolsPageFetch = () => {
  const dispatch = useAppDispatch()
  const { account, chainId } = useAccountActiveChain()

  usePoolsConfigInitialize()

  useFetchPublicPoolsData()

  useFastRefreshEffect(() => {
    if (chainId) {
      batch(() => {
        dispatch(fetchCakeVaultPublicData(chainId))
        dispatch(fetchCakeFlexibleSideVaultPublicData(chainId))
        dispatch(fetchIfoPublicDataAsync(chainId))
        if (account) {
          dispatch(fetchPoolsUserDataAsync({ account, chainId }))
          dispatch(fetchCakeVaultUserData({ account, chainId }))
          dispatch(fetchCakeFlexibleSideVaultUserData({ account, chainId }))
        }
      })
    }
  }, [account, chainId, dispatch])

  useEffect(() => {
    if (chainId) {
      batch(() => {
        dispatch(fetchCakeVaultFees(chainId))
        dispatch(fetchCakeFlexibleSideVaultFees(chainId))
      })
    }
  }, [dispatch, chainId])
}

export const useCakeVaultUserData = () => {
  const { address: account } = useAccount()
  const dispatch = useAppDispatch()
  const { chainId } = useActiveChainId()

  useFastRefreshEffect(() => {
    if (account && chainId) {
      dispatch(fetchCakeVaultUserData({ account, chainId }))
    }
  }, [account, dispatch, chainId])
}

export const useCakeVaultPublicData = () => {
  const dispatch = useAppDispatch()
  const { chainId } = useActiveChainId()
  useFastRefreshEffect(() => {
    if (chainId) {
      dispatch(fetchCakeVaultPublicData(chainId))
    }
  }, [dispatch, chainId])
}

export const useFetchIfo = () => {
  const { account, chainId } = useAccountActiveChain()
  const dispatch = useAppDispatch()

  usePoolsConfigInitialize()

  useSWRImmutable(
    chainId && ['fetchIfoPublicData', chainId],
    async () => {
      const cakePriceFarms = await getCakePriceFarms(chainId)
      await dispatch(fetchFarmsPublicDataAsync({ pids: cakePriceFarms, chainId }))
      batch(() => {
        dispatch(fetchCakePoolPublicDataAsync())
        dispatch(fetchCakeVaultPublicData(chainId))
        dispatch(fetchIfoPublicDataAsync(chainId))
      })
    },
    {
      refreshInterval: FAST_INTERVAL,
    },
  )

  useSWRImmutable(
    account && chainId && ['fetchIfoUserData', account, chainId],
    async () => {
      batch(() => {
        dispatch(fetchCakePoolUserDataAsync({ account, chainId }))
        dispatch(fetchCakeVaultUserData({ account, chainId }))
        dispatch(fetchUserIfoCreditDataAsync({ account, chainId }))
      })
    },
    {
      refreshInterval: FAST_INTERVAL,
    },
  )

  useSWRImmutable(chainId && ['fetchCakeVaultFees', chainId], async () => {
    dispatch(fetchCakeVaultFees(chainId))
  })
}

export const useCakeVault = () => {
  return useVaultPoolByKey(VaultKey.CakeVault)
}

export const useVaultPoolByKey = (key: VaultKey) => {
  const vaultPoolByKey = useMemo(() => makeVaultPoolByKey(key), [key])

  return useSelector(vaultPoolByKey)
}

export const useIfoCredit = () => {
  return useSelector(ifoCreditSelector)
}

export const useIfoCeiling = () => {
  return useSelector(ifoCeilingSelector)
}
