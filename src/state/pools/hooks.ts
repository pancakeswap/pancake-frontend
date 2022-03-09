import { useEffect, useMemo } from 'react'
import { useWeb3React } from '@web3-react/core'
import { batch, useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import { useFastRefreshEffect, useSlowRefreshEffect } from 'hooks/useRefreshEffect'
import {
  fetchPoolsPublicDataAsync,
  fetchPoolsUserDataAsync,
  fetchCakeVaultPublicData,
  fetchCakeVaultUserData,
  fetchCakeVaultFees,
  fetchPoolsStakingLimitsAsync,
  fetchIfoPoolFees,
  fetchIfoPoolPublicData,
  fetchIfoPoolUserAndCredit,
  fetchCakePoolPublicDataAsync,
  fetchCakePoolUserDataAsync,
} from '.'
import { DeserializedPool, VaultKey } from '../types'
import { fetchFarmsPublicDataAsync, nonArchivedFarms } from '../farms'
import { useCurrentBlock } from '../block/hooks'
import {
  poolsWithUserDataLoadingSelector,
  makePoolWithUserDataLoadingSelector,
  makeVaultPoolByKey,
  poolsWithVaultSelector,
  ifoPoolCreditBlockSelector,
  ifoPoolCreditSelector,
  ifoWithAprSelector,
} from './selectors'

export const useFetchPublicPoolsData = () => {
  const dispatch = useAppDispatch()

  useSlowRefreshEffect(
    (currentBlock) => {
      const fetchPoolsDataWithFarms = async () => {
        const activeFarms = nonArchivedFarms.filter((farm) => farm.pid !== 0)
        await dispatch(fetchFarmsPublicDataAsync(activeFarms.map((farm) => farm.pid)))
        batch(() => {
          dispatch(fetchPoolsPublicDataAsync(currentBlock))
          dispatch(fetchPoolsStakingLimitsAsync())
        })
      }

      fetchPoolsDataWithFarms()
    },
    [dispatch],
  )
}

export const useFetchUserPools = (account) => {
  const dispatch = useAppDispatch()

  useFastRefreshEffect(() => {
    if (account) {
      dispatch(fetchPoolsUserDataAsync(account))
    }
  }, [account, dispatch])
}

export const usePools = (): { pools: DeserializedPool[]; userDataLoaded: boolean } => {
  return useSelector(poolsWithUserDataLoadingSelector)
}

export const usePool = (sousId: number): { pool: DeserializedPool; userDataLoaded: boolean } => {
  const poolWithUserDataLoadingSelector = useMemo(() => makePoolWithUserDataLoadingSelector(sousId), [sousId])
  return useSelector(poolWithUserDataLoadingSelector)
}

export const usePoolsWithVault = () => {
  return useSelector(poolsWithVaultSelector)
}

export const usePoolsPageFetch = () => {
  const { account } = useWeb3React()
  const dispatch = useAppDispatch()
  useFetchPublicPoolsData()

  useFastRefreshEffect(() => {
    batch(() => {
      dispatch(fetchCakeVaultPublicData())
      dispatch(fetchIfoPoolPublicData())
      if (account) {
        dispatch(fetchPoolsUserDataAsync(account))
        dispatch(fetchCakeVaultUserData({ account }))
        dispatch(fetchIfoPoolUserAndCredit({ account }))
      }
    })
  }, [account, dispatch])

  useEffect(() => {
    batch(() => {
      dispatch(fetchIfoPoolFees())
      dispatch(fetchCakeVaultFees())
    })
  }, [dispatch])
}

export const useFetchIfoPool = (fetchCakePool = true) => {
  const { account } = useWeb3React()
  const dispatch = useAppDispatch()

  useFastRefreshEffect(() => {
    batch(() => {
      if (fetchCakePool) {
        if (account) {
          dispatch(fetchCakePoolUserDataAsync(account))
        }
        dispatch(fetchCakePoolPublicDataAsync())
      }
      if (account) {
        dispatch(fetchIfoPoolUserAndCredit({ account }))
      }
      dispatch(fetchIfoPoolPublicData())
    })
  }, [dispatch, account, fetchCakePool])

  useEffect(() => {
    dispatch(fetchIfoPoolFees())
  }, [dispatch])
}

export const useCakeVault = () => {
  return useVaultPoolByKey(VaultKey.CakeVault)
}

export const useVaultPools = () => {
  const cakeVault = useVaultPoolByKey(VaultKey.CakeVault)
  const ifoVault = useVaultPoolByKey(VaultKey.IfoPool)
  const vaults = useMemo(() => {
    return {
      [VaultKey.CakeVault]: cakeVault,
      [VaultKey.IfoPool]: ifoVault,
    }
  }, [cakeVault, ifoVault])
  return vaults
}

export const useVaultPoolByKey = (key: VaultKey) => {
  const vaultPoolByKey = useMemo(() => makeVaultPoolByKey(key), [key])
  return useSelector(vaultPoolByKey)
}

export const useIfoPoolVault = () => {
  return useVaultPoolByKey(VaultKey.IfoPool)
}

export const useIfoPoolCreditBlock = () => {
  const currentBlock = useCurrentBlock()
  const { creditStartBlock, creditEndBlock } = useSelector(ifoPoolCreditBlockSelector)
  const hasEndBlockOver = currentBlock >= creditEndBlock
  return { creditStartBlock, creditEndBlock, hasEndBlockOver }
}

export const useIfoPoolCredit = () => {
  return useSelector(ifoPoolCreditSelector)
}

export const useIfoWithApr = () => {
  return useSelector(ifoWithAprSelector)
}
