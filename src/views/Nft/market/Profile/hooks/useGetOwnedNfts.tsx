import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import Nfts from 'config/constants/nfts'
import { State } from 'state/types'
import { fetchWalletNfts } from 'state/collectibles'

// We need to fetch collectibles for non-connected accounts, hence this hook accepts an account string.
const useGetOwnedNfts = (account: string) => {
  const dispatch = useAppDispatch()
  const { data } = useSelector((state: State) => state.collectibles)

  const identifiers = Object.keys(data)

  useEffect(() => {
    if (account) {
      dispatch(fetchWalletNfts(account))
    }
  }, [dispatch, account])

  return {
    tokenIds: data,
    nftsInWallet: Nfts.pancake.filter((nft) => identifiers.includes(nft.identifier)),
  }
}

export default useGetOwnedNfts
