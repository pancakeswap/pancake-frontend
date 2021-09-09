import { useEffect } from 'react'
import { useAppDispatch } from 'state'
import { fetchUserNfts } from 'state/nftMarket/reducer'
import { useUserNfts } from 'state/nftMarket/hooks'
import usePreviousValue from 'hooks/usePreviousValue'
import { useProfile } from 'state/profile/hooks'

// We need to fetch collectibles for non-connected accounts, hence this hook accepts an account string.
const useFetchUserNfts = (account: string) => {
  const dispatch = useAppDispatch()
  const { profile, isInitialized: isProfileInitialized } = useProfile()
  const { isInitialized } = useUserNfts()
  // TODO: This tokenId is showing for the previous user on account switch
  const profileNftTokenId = profile?.tokenId?.toString()
  const previousAccount = usePreviousValue(account)

  const hasAccountSwitched = previousAccount !== account && isProfileInitialized
  const shouldFetch = account && !isInitialized && isProfileInitialized

  useEffect(() => {
    if (shouldFetch || hasAccountSwitched) {
      dispatch(fetchUserNfts({ account, profileNftTokenId }))
    }
  }, [dispatch, account, shouldFetch, hasAccountSwitched, profileNftTokenId])
}

export default useFetchUserNfts
