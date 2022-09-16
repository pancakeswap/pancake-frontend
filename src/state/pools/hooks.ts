import { useEffect, useMemo } from 'react'
import { useWeb3React } from '@pancakeswap/wagmi'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { batch, useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import { useFastRefreshEffect, useSlowRefreshEffect } from 'hooks/useRefreshEffect'
import { featureFarmApiAtom, useFeatureFlag } from 'hooks/useFeatureFlag'
import { getFarmConfig } from '@pancakeswap/farms/constants'
import { livePools } from 'config/constants/pools'

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
} from '.'
import { DeserializedPool, VaultKey } from '../types'
import { fetchFarmsPublicDataAsync } from '../farms'
import {
  makePoolWithUserDataLoadingSelector,
  makeVaultPoolByKey,
  poolsWithVaultSelector,
  ifoCreditSelector,
  ifoCeilingSelector,
  makeVaultPoolWithKeySelector,
} from './selectors'

const lPoolAddresses = livePools.filter(({ sousId }) => sousId !== 0).map(({ earningToken }) => earningToken.address)

// Only fetch farms for live pools
const getActiveFarms = async (chainId: number) => {
  const farmsConfig = await getFarmConfig(chainId)
  return farmsConfig
    .filter(
      ({ token, pid, quoteToken }) =>
        pid !== 0 &&
        ((token.symbol === 'BUSD' && quoteToken.symbol === 'WBNB') ||
          lPoolAddresses.find((poolAddress) => poolAddress === token.address)),
    )
    .map((farm) => farm.pid)
}

export const useFetchPublicPoolsData = () => {
  const dispatch = useAppDispatch()
  const { chainId } = useActiveWeb3React()
  const farmFlag = useFeatureFlag(featureFarmApiAtom)

  useSlowRefreshEffect(
    (currentBlock) => {
      const fetchPoolsDataWithFarms = async () => {
        const activeFarms = await getActiveFarms(chainId)
        await dispatch(fetchFarmsPublicDataAsync({ pids: activeFarms, chainId, flag: farmFlag }))

        batch(() => {
          dispatch(fetchPoolsPublicDataAsync(currentBlock, chainId))
          dispatch(fetchPoolsStakingLimitsAsync())
        })
      }

      fetchPoolsDataWithFarms()
    },
    [dispatch, chainId, farmFlag],
  )
}

export const usePool = (sousId: number): { pool: DeserializedPool; userDataLoaded: boolean } => {
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

export const usePoolsPageFetch = () => {
  const { account } = useWeb3React()
  const dispatch = useAppDispatch()
  useFetchPublicPoolsData()

  useFastRefreshEffect(() => {
    batch(() => {
      dispatch(fetchCakeVaultPublicData())
      dispatch(fetchCakeFlexibleSideVaultPublicData())
      dispatch(fetchIfoPublicDataAsync())
      if (account) {
        dispatch(fetchPoolsUserDataAsync(account))
        dispatch(fetchCakeVaultUserData({ account }))
        dispatch(fetchCakeFlexibleSideVaultUserData({ account }))
      }
    })
  }, [account, dispatch])

  useEffect(() => {
    batch(() => {
      dispatch(fetchCakeVaultFees())
      dispatch(fetchCakeFlexibleSideVaultFees())
    })
  }, [dispatch])
}

export const useCakeVaultUserData = () => {
  const { account } = useWeb3React()
  const dispatch = useAppDispatch()

  useFastRefreshEffect(() => {
    if (account) {
      dispatch(fetchCakeVaultUserData({ account }))
    }
  }, [account, dispatch])
}

export const useCakeVaultPublicData = () => {
  const dispatch = useAppDispatch()
  useFastRefreshEffect(() => {
    dispatch(fetchCakeVaultPublicData())
  }, [dispatch])
}

export const useFetchIfo = () => {
  const { account } = useWeb3React()
  const dispatch = useAppDispatch()

  useFastRefreshEffect(() => {
    batch(() => {
      dispatch(fetchCakeVaultPublicData())
      dispatch(fetchIfoPublicDataAsync())
      if (account) {
        dispatch(fetchCakePoolUserDataAsync(account))
        dispatch(fetchCakeVaultUserData({ account }))
        dispatch(fetchUserIfoCreditDataAsync(account))
      }
    })
  }, [dispatch, account])

  useEffect(() => {
    dispatch(fetchCakeVaultFees())
  }, [dispatch])
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
