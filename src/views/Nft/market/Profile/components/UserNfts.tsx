import React, { useState, useEffect } from 'react'
import { Grid, useModal } from '@pancakeswap/uikit'
import { useUserNfts } from 'state/nftMarket/hooks'
import { NFT, NftLocation } from 'state/nftMarket/types'
import { CollectibleCard } from '../../components/CollectibleCard'
import GridPlaceholder from '../../components/GridPlaceholder'
import ProfileNftModal from '../../components/ProfileNftModal'

const UserNfts = () => {
  const { nfts } = useUserNfts()
  const [clicked, setClicked] = useState<{ nft: NFT; location: NftLocation }>({ nft: null, location: null })
  const [onProfileNftModal] = useModal(<ProfileNftModal nft={clicked.nft} />, false)

  const handleCollectibleClick = (nft: NFT, location: NftLocation) => {
    setClicked({ nft, location })
  }

  useEffect(() => {
    switch (clicked.location) {
      case NftLocation.PROFILE:
        onProfileNftModal()
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
    // exhaustive deps disabled as the useModal dep causes re-render loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clicked])

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
                onClick={() => handleCollectibleClick(nft, marketData.nftLocation)}
                key={nft.tokenId}
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
