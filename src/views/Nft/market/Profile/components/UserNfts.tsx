import React, { useState, useEffect } from 'react'
import { Grid, useModal, Text, Flex } from '@pancakeswap/uikit'
import { useUserNfts } from 'state/nftMarket/hooks'
import { NftLocation, UserNftInitializationState, NftToken } from 'state/nftMarket/types'
import { useTranslation } from 'contexts/Localization'
import { CollectibleActionCard } from '../../components/CollectibleCard'
import GridPlaceholder from '../../components/GridPlaceholder'
import ProfileNftModal from '../../components/ProfileNftModal'
import NoNftsImage from './NoNftsImage'
import SellModal from '../../components/BuySellModals/SellModal'

interface ProfileNftProps {
  nft: NftToken
  location: NftLocation
}

interface SellNftProps {
  nft: NftToken
  location: NftLocation
  variant: 'sell' | 'edit'
}

const UserNfts = () => {
  const { nfts, userNftsInitializationState } = useUserNfts()
  const [clickedProfileNft, setClickedProfileNft] = useState<ProfileNftProps>({ nft: null, location: null })
  const [clickedSellNft, setClickedSellNft] = useState<SellNftProps>({ nft: null, location: null, variant: null })
  const [onPresentProfileNftModal] = useModal(<ProfileNftModal nft={clickedProfileNft.nft} />)
  const [onPresentSellModal] = useModal(<SellModal variant={clickedSellNft.variant} nftToSell={clickedSellNft.nft} />)
  const { t } = useTranslation()

  const handleCollectibleClick = (nft: NftToken, location: NftLocation) => {
    switch (location) {
      case NftLocation.PROFILE:
        setClickedProfileNft({ nft, location })
        break
      case NftLocation.WALLET:
        setClickedSellNft({ nft, location, variant: 'sell' })
        break
      case NftLocation.FORSALE:
        setClickedSellNft({ nft, location, variant: 'edit' })
        break
      default:
        break
    }
  }

  useEffect(() => {
    if (clickedProfileNft.nft) {
      onPresentProfileNftModal()
    }
    // exhaustive deps disabled as the useModal dep causes re-render loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clickedProfileNft])

  useEffect(() => {
    if (clickedSellNft.nft) {
      onPresentSellModal()
    }
    // exhaustive deps disabled as the useModal dep causes re-render loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clickedSellNft])

  return (
    <>
      {/* User has no NFTs */}
      {nfts.length === 0 && userNftsInitializationState === UserNftInitializationState.INITIALIZED ? (
        <Flex p="24px" flexDirection="column" alignItems="center">
          <NoNftsImage />
          <Text pt="8px" bold>
            {t('No NFTs found')}
          </Text>
        </Flex>
      ) : // User has NFTs and data has been fetched
      nfts.length > 0 ? (
        <Grid
          gridGap="16px"
          gridTemplateColumns={['1fr', 'repeat(2, 1fr)', 'repeat(3, 1fr)', null, 'repeat(4, 1fr)']}
          alignItems="start"
        >
          {nfts.map((nft) => {
            const { marketData, location } = nft

            return (
              <CollectibleActionCard
                isUserNft
                onClick={() => handleCollectibleClick(nft, location)}
                key={`${nft.tokenId}-${nft.collectionName}`}
                nft={nft}
                currentAskPrice={
                  marketData?.currentAskPrice && marketData?.isTradable && parseFloat(marketData.currentAskPrice)
                }
                nftLocation={location}
              />
            )
          })}
        </Grid>
      ) : (
        // User NFT data hasn't been fetched
        <GridPlaceholder />
      )}
    </>
  )
}

export default UserNfts
