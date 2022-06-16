import { useWeb3React } from '@web3-react/core'
import { batch, useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import { useFastRefreshEffect } from 'hooks/useRefreshEffect'
import { fetchCakeVaultPublicData, fetchCakeVaultUserData } from 'state/pools'
import { fetchPotteryUserDataAsync } from './index'
import { potterySelector } from './selectors'

export const usePotteryFetch = () => {
  const { account } = useWeb3React()
  const dispatch = useAppDispatch()

  useFastRefreshEffect(() => {
    batch(() => {
      dispatch(fetchCakeVaultPublicData())
      if (account) {
        dispatch(fetchPotteryUserDataAsync(account))
        dispatch(fetchCakeVaultUserData({ account }))
      }
    })
  }, [account, dispatch])
}

export const usePottery = () => {
  return useSelector(potterySelector)
}
