import { ChainId } from '@pancakeswap/chains'
import { getSourceChain, isIfoSupported } from '@pancakeswap/ifos'
import { Token } from '@pancakeswap/sdk'
import { Pool } from '@pancakeswap/widgets-internal'
import { FAST_INTERVAL } from 'config/constants'
import { useFastRefreshEffect, useSlowRefreshEffect } from 'hooks/useRefreshEffect'
import { useEffect, useMemo } from 'react'
import { batch, useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import { useAccount } from 'wagmi'

import { useQuery } from '@tanstack/react-query'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { useActiveChainId } from 'hooks/useActiveChainId'
import {
  fetchCakeFlexibleSideVaultFees,
  fetchCakeFlexibleSideVaultPublicData,
  fetchCakeFlexibleSideVaultUserData,
  fetchCakePoolPublicDataAsync,
  fetchCakePoolUserDataAsync,
  fetchCakeVaultFees,
  fetchCakeVaultPublicData,
  fetchCakeVaultUserData,
  fetchIfoPublicDataAsync,
  fetchPoolsPublicDataAsync,
  fetchPoolsStakingLimitsAsync,
  fetchPoolsUserDataAsync,
  fetchUserIfoCreditDataAsync,
  setInitialPoolConfig,
} from '.'
import { VaultKey } from '../types'
import {
  ifoCeilingSelector,
  ifoCreditSelector,
  makePoolWithUserDataLoadingSelector,
  makeVaultPoolByKey,
  makeVaultPoolWithKeySelector,
  poolsWithVaultSelector,
} from './selectors'

export const useFetchPublicPoolsData = () => {
  const dispatch = useAppDispatch()
  const { chainId } = useActiveChainId()

  useSlowRefreshEffect(() => {
    const fetchPoolsDataWithFarms = async () => {
      if (!chainId) return
      batch(() => {
        dispatch(fetchPoolsPublicDataAsync(chainId))
        dispatch(fetchPoolsStakingLimitsAsync(chainId))
      })
    }

    fetchPoolsDataWithFarms()
  }, [dispatch, chainId])
}

export const usePool = (sousId: number): { pool?: Pool.DeserializedPool<Token>; userDataLoaded: boolean } => {
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

const useCakeVaultChain = (chainId?: ChainId) => {
  return useMemo(() => getSourceChain(chainId) || ChainId.BSC, [chainId])
}

export const useFetchIfo = () => {
  const { account, chainId } = useAccountActiveChain()
  const ifoSupported = useMemo(() => isIfoSupported(chainId), [chainId])
  const cakeVaultChain = useCakeVaultChain(chainId)
  const dispatch = useAppDispatch()

  usePoolsConfigInitialize()

  useQuery({
    queryKey: ['fetchIfoPublicData', chainId],

    queryFn: async () => {
      if (chainId && cakeVaultChain) {
        batch(() => {
          dispatch(fetchCakePoolPublicDataAsync())
          dispatch(fetchCakeVaultPublicData(cakeVaultChain))
          dispatch(fetchIfoPublicDataAsync(chainId))
        })
      }
      return null
    },

    enabled: Boolean(chainId && ifoSupported),
    refetchInterval: FAST_INTERVAL,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })

  useQuery({
    queryKey: ['fetchIfoUserData', account, chainId],

    queryFn: async () => {
      if (chainId && cakeVaultChain && account) {
        batch(() => {
          dispatch(fetchCakePoolUserDataAsync({ account, chainId: cakeVaultChain }))
          dispatch(fetchCakeVaultUserData({ account, chainId: cakeVaultChain }))
          dispatch(fetchUserIfoCreditDataAsync({ account, chainId }))
        })
      }
      return null
    },

    enabled: Boolean(account && chainId && cakeVaultChain),
    refetchInterval: FAST_INTERVAL,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })

  useQuery({
    queryKey: ['fetchCakeVaultFees', cakeVaultChain],

    queryFn: async () => {
      if (cakeVaultChain) {
        dispatch(fetchCakeVaultFees(cakeVaultChain))
      }
      return null
    },

    enabled: Boolean(cakeVaultChain && ifoSupported),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })
}

export const useCakeVault = () => {
  return useVaultPoolByKey(VaultKey.CakeVault)
}

export const useVaultPoolByKey = (key?: VaultKey) => {
  const vaultPoolByKey = useMemo(() => makeVaultPoolByKey(key), [key])

  return useSelector(vaultPoolByKey)
}

export const useIfoCredit = () => {
  return useSelector(ifoCreditSelector)
}

export const useIfoCeiling = () => {
  return useSelector(ifoCeilingSelector)
}
