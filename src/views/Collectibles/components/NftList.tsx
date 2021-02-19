import React, { useCallback, useEffect, useState } from 'react'
import orderBy from 'lodash/orderBy'
import nfts from 'config/constants/nfts'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { getBunnySpecialContract } from 'utils/contractHelpers'
import useGetWalletNfts from 'hooks/useGetWalletNfts'
import makeBatchRequest from 'utils/makeBatchRequest'
import { useToast } from 'state/hooks'
import NftCard from './NftCard'
import NftGrid from './NftGrid'

type State = {
  [key: string]: boolean
}

const bunnySpecialContract = getBunnySpecialContract()

const NftList = () => {
  const [claimableNfts, setClaimableNfts] = useState<State>({})
  const { nfts: nftTokenIds, refresh } = useGetWalletNfts()
  const { account } = useWallet()
  const { toastError } = useToast()

  const fetchClaimableStatuses = useCallback(
    async (walletAddress: string) => {
      try {
        const claimStatuses = (await makeBatchRequest(
          nfts.map((nft) => {
            return bunnySpecialContract.methods.canClaimSingle(walletAddress, nft.bunnyId).call
          }),
        )) as boolean[]

        setClaimableNfts(
          claimStatuses.reduce((accum, claimStatus, index) => {
            return {
              ...accum,
              [nfts[index].bunnyId]: claimStatus,
            }
          }, {}),
        )
      } catch (error) {
        console.error(error)
        toastError('Error checking NFT claimable status')
      }
    },
    [setClaimableNfts, toastError],
  )

  const handleSuccess = () => {
    refresh()
    fetchClaimableStatuses(account)
  }

  useEffect(() => {
    if (account) {
      fetchClaimableStatuses(account)
    }
  }, [account, fetchClaimableStatuses])

  return (
    <NftGrid>
      {orderBy(nfts, 'sortOrder').map((nft) => {
        const tokenIds = nftTokenIds[nft.bunnyId] ? nftTokenIds[nft.bunnyId].tokenIds : []

        return (
          <div key={nft.name}>
            <NftCard nft={nft} canClaim={claimableNfts[nft.bunnyId]} tokenIds={tokenIds} onSuccess={handleSuccess} />
          </div>
        )
      })}
    </NftGrid>
  )
}

export default NftList
