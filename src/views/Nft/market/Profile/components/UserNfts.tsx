import React from 'react'
import { Grid } from '@pancakeswap/uikit'
import { useUserNfts } from 'state/nftMarket/hooks'
import { NftLocation } from 'state/nftMarket/types'
import { CollectibleCard } from '../../components/CollectibleCard'
import GridPlaceholder from '../../components/GridPlaceholder'

const UserNfts = () => {
  const { nfts } = useUserNfts()

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
      {nfts.length > 0 ? (
        <Grid
          gridGap="16px"
          gridTemplateColumns={['1fr', 'repeat(2, 1fr)', 'repeat(3, 1fr)', null, 'repeat(4, 1fr)']}
          alignItems="start"
        >
          {nfts.map((nft) => {
            const marketData = nft.tokens[nft.tokenId]

            return (
              <CollectibleCard
                onClick={() => handleCollectibleClick(marketData.nftLocation)}
                key={nft.id}
                nft={nft}
                currentAskPrice={
                  marketData.currentAskPrice && marketData.isTradable && parseFloat(marketData.currentAskPrice)
                }
                nftLocation={marketData.nftLocation}
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
