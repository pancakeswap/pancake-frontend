import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useAppDispatch } from 'state'
import { FAST_INTERVAL } from 'config/constants'
import useSWRImmutable from 'swr/immutable'
import { batch } from 'react-redux'
import {
  fetchCakeVaultPublicData,
  fetchCakePoolPublicDataAsync,
  fetchCakePoolUserDataAsync,
  fetchCakeVaultUserData,
} from 'state/pools'
import { usePoolsConfigInitialize } from 'state/pools/hooks'

export const useCakeVaultPool = () => {
  const { account, chainId } = useActiveWeb3React()
  const dispatch = useAppDispatch()

  usePoolsConfigInitialize()

  useSWRImmutable(
    'fetchCakePoolData',
    async () => {
      batch(() => {
        dispatch(fetchCakePoolPublicDataAsync())
        dispatch(fetchCakeVaultPublicData(chainId))
      })
    },
    {
      refreshInterval: FAST_INTERVAL,
    },
  )

  useSWRImmutable(
    account && ['fetchCakePoolUserData', account],
    async () => {
      batch(() => {
        dispatch(fetchCakePoolUserDataAsync({ account, chainId }))
        dispatch(fetchCakeVaultUserData({ account, chainId }))
      })
    },
    {
      refreshInterval: FAST_INTERVAL,
    },
  )
}
