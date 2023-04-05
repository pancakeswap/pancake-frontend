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

export const useCakeVaultPool = () => {
  const { account } = useActiveWeb3React()
  const dispatch = useAppDispatch()

  useSWRImmutable(
    'fetchCakePoolData',
    async () => {
      batch(() => {
        dispatch(fetchCakePoolPublicDataAsync())
        dispatch(fetchCakeVaultPublicData())
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
        dispatch(fetchCakePoolUserDataAsync(account))
        dispatch(fetchCakeVaultUserData({ account }))
      })
    },
    {
      refreshInterval: FAST_INTERVAL,
    },
  )
}
