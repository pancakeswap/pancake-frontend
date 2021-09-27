import { useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import Nfts from 'config/constants/nfts'
import { State } from '../types'
import { fetchWalletNfts } from './index'

const MAX_GEN0_ID = 4

export const useGetCollectibles = () => {
  const { account } = useWeb3React()
  const dispatch = useAppDispatch()
  const { isInitialized, isLoading, data } = useSelector((state: State) => state.collectibles)

  const identifiers = Object.keys(data)

  useEffect(() => {
    // Fetch nfts only if we have not done so already
    if (!isInitialized && account) {
      dispatch(fetchWalletNfts(account))
    }
  }, [isInitialized, account, dispatch])

  const nftsInWallet = Nfts.pancake.filter((nft) => identifiers.includes(nft.identifier))
  const hasGen0 = nftsInWallet?.some((nft) => nft.id <= MAX_GEN0_ID)

  return {
    isInitialized,
    isLoading,
    tokenIds: data,
    hasGen0,
    nftsInWallet,
  }
}
