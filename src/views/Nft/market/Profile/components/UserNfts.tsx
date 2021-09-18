import React from 'react'
import styled from 'styled-components'
import { Grid, Text, Flex } from '@pancakeswap/uikit'
import { useGetCollections, useGetNftMetadata, useUserNfts } from 'state/nftMarket/hooks'
import { NftLocation } from 'state/nftMarket/types'
import { getAddress } from 'ethers/lib/utils'
import { useTranslation } from 'contexts/Localization'
import { CollectibleCard } from '../../components/CollectibleCard'
import GridPlaceholder from '../../components/GridPlaceholder'

const NoNftsImage = styled.div`
  background: url('/images/nfts/no-profile-md.png');
  background-repeat: no-repeat;
  background-size: cover;
  border-radius: 50%;
  position: relative;
  width: 96px;
  height: 96px;

  & > img {
    border-radius: 50%;
  }
`

const UserNfts = () => {
  const { t } = useTranslation()
  const { nfts: userNfts, userNftsInitialised } = useUserNfts()
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
      {/* User has no NFTs */}
      {userNftsInitialised && userNfts.length === 0 ? (
        <Flex p="24px" flexDirection="column" alignItems="center">
          <NoNftsImage />
          <Text pt="8px" bold>
            {t('No NFTs found')}
          </Text>
        </Flex>
      ) : // User has NFTs, and metadata has been fetched
      nftMetadata.length > 0 ? (
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
        // User has NFTs but metadata hasn't been fetched
        <GridPlaceholder />
      )}
    </>
  )
}

export default UserNfts
