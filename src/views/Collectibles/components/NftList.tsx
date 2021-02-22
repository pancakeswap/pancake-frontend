import React, { useCallback, useEffect, useState } from 'react'
import orderBy from 'lodash/orderBy'
import nfts from 'config/constants/nfts'
import { useWeb3React } from '@web3-react/core'
import { getBunnySpecialAddress } from 'utils/addressHelpers'
import useGetWalletNfts from 'hooks/useGetWalletNfts'
import multicall from 'utils/multicall'
import bunnySpecialAbi from 'config/abi/bunnySpecial.json'
import { useToast } from 'state/hooks'
import NftCard from './NftCard'
import NftGrid from './NftGrid'

type State = {
  [key: string]: boolean
}

const NftList = () => {
  const [claimableNfts, setClaimableNfts] = useState<State>({})
  const { nfts: nftTokenIds, refresh } = useGetWalletNfts()
  const { account } = useWeb3React()
  const { toastError } = useToast()

  const fetchClaimableStatuses = useCallback(
    async (walletAddress: string) => {
      try {
        const response = (await multicall(
          bunnySpecialAbi,
          nfts.map((nft) => ({
            address: getBunnySpecialAddress(),
            name: 'canClaimSingle',
            params: [walletAddress, nft.bunnyId],
          })),
        )) as boolean[][]

        // ClaimStatuses return as an array of arrays
        // E.g. [[true], [false]]
        const claimStatuses = response.map((claimStatusArr) => {
          if (claimStatusArr.length === 1) {
            return claimStatusArr[0]
          }

          return false
        })

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
