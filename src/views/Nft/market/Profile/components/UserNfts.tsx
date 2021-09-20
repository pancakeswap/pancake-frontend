import React, { useState, useEffect } from 'react'
import styled from 'styled-components
import { useWeb3React } from '@web3-react/core'
import { Grid, useModal } from '@pancakeswap/uikit'
import { useGetCollections, useGetNftMetadata, useUserNfts } from 'state/nftMarket/hooks'
import { NFT, NftLocation } from 'state/nftMarket/types'
import { getAddress } from 'ethers/lib/utils'
import { useTranslation } from 'contexts/Localization'
import { CollectibleCard } from '../../components/CollectibleCard'
import GridPlaceholder from '../../components/GridPlaceholder'
import ProfileNftModal from '../../components/ProfileNftModal'

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
  const { nfts: userNfts } = useUserNfts()
  const { account } = useWeb3React()
  const [clicked, setClicked] = useState<{ nft: NFT; location: NftLocation }>({ nft: null, location: null })
  const [onProfileNftModal] = useModal(<ProfileNftModal nft={clicked.nft} />, false)
  const nftMetadata = useGetNftMetadata(userNfts, account)
  const collections = useGetCollections()


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
                onClick={() => handleCollectibleClick(nftDataForCard, userNft.nftLocation)}
                key={userNft.tokenId}
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
