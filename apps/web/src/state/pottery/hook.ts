import { useAccount } from 'wagmi'
import { batch, useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import { useFastRefreshEffect } from 'hooks/useRefreshEffect'
import { fetchCakeVaultPublicData, fetchCakeVaultUserData } from 'state/pools'
import { fetchLastVaultAddressAsync, fetchPublicPotteryDataAsync, fetchPotteryUserDataAsync } from './index'
import { potteryDataSelector } from './selectors'
import { State } from '../types'

export const usePotteryFetch = () => {
  const { address: account } = useAccount()
  const dispatch = useAppDispatch()
  const potteryVaultAddress = useLatestVaultAddress()

  useFastRefreshEffect(() => {
    dispatch(fetchLastVaultAddressAsync())

    if (potteryVaultAddress) {
      batch(() => {
        dispatch(fetchCakeVaultPublicData())
        dispatch(fetchPublicPotteryDataAsync())
        if (account) {
          dispatch(fetchPotteryUserDataAsync(account))
          dispatch(fetchCakeVaultUserData({ account }))
        }
      })
    }
  }, [potteryVaultAddress, account, dispatch])
}

export const usePotteryData = () => {
  return useSelector(potteryDataSelector)
}

export const useLatestVaultAddress = () => {
  return useSelector((state: State) => state.pottery.lastVaultAddress)
}
