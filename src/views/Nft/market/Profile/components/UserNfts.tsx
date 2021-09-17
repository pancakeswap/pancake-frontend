import React from 'react'
import { Grid } from '@pancakeswap/uikit'
import { useGetCollections, useGetNftMetadata, useUserNfts } from 'state/nftMarket/hooks'
import { NftLocation } from 'state/nftMarket/types'
import { getAddress } from 'ethers/lib/utils'
import { CollectibleCard } from '../../components/CollectibleCard'
import GridPlaceholder from '../../components/GridPlaceholder'

const UserNfts = () => {
  const { nfts: userNfts } = useUserNfts()
  const nftMetadata = useGetNftMetadata(userNfts)
  const collections = useGetCollections()

  const handleCollectibleClick = (nftLocation: NftLocation) => {
    switch (nftLocation) {
      case NftLocation.PROFILE:
        // TRIGGER PROFILE ACTIONS
        break
      case NftLocation.FORSALE:
        // TRIGGER ON-SALE ACTION
        break
      case NftLocation.WALLET:
        // TRIGGER WALLET ACTIONS
        break
      default:
        break
    }
  }

  return (
    <>
      {nftMetadata.length > 0 ? (
        <Grid
          gridGap="16px"
          gridTemplateColumns={['1fr', 'repeat(2, 1fr)', 'repeat(3, 1fr)', null, 'repeat(4, 1fr)']}
          alignItems="start"
        >
          {userNfts.map((userNft) => {
            const nftDataForCard = nftMetadata.find((nft) => nft.tokenId === userNft.tokenId)
            const checksummedAddress = getAddress(userNft.collection.id)
            const collectionName = collections[checksummedAddress]?.name || '-'
            return (
              <CollectibleCard
                onClick={() => handleCollectibleClick(userNft.nftLocation)}
                key={nftDataForCard.id}
                collectionName={collectionName}
                nft={nftDataForCard}
                currentAskPrice={userNft.currentAskPrice && userNft.isTradable && parseFloat(userNft.currentAskPrice)}
                nftLocation={userNft.nftLocation}
              />
            )
          })}
        </Grid>
      ) : (
        <GridPlaceholder />
      )}
    </>
  )
}

export default UserNfts
