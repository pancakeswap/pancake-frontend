import React, { useState } from 'react'
import { BunnyPlaceholderIcon, Button, Flex, Grid, Text } from '@pancakeswap/uikit'
import { useGetNftFilterLoadingState, useNftsFromCollection } from 'state/nftMarket/hooks'
import { Collection, NftFilterLoadingState } from 'state/nftMarket/types'
import { useTranslation } from 'contexts/Localization'
import GridPlaceholder from '../../components/GridPlaceholder'
import { CollectibleLinkCard } from '../../components/CollectibleCard'
import { REQUEST_SIZE } from '../config'

interface FilteredCollectionNftsProps {
  collection: Collection
}

const FilteredCollectionNfts: React.FC<FilteredCollectionNftsProps> = ({ collection }) => {
  const { address: collectionAddress } = collection
  const [numToShow, setNumToShow] = useState(REQUEST_SIZE)
  const { t } = useTranslation()
  const collectionNfts = useNftsFromCollection(collectionAddress)
  const nftFilterLoadingState = useGetNftFilterLoadingState()

  const handleLoadMore = () => {
    setNumToShow((prevNumToShow) => prevNumToShow + REQUEST_SIZE)
  }

  if (nftFilterLoadingState === NftFilterLoadingState.LOADING) {
    return <GridPlaceholder />
  }

  const nftsToShow = collectionNfts ? collectionNfts.slice(0, numToShow) : []

  return (
    <>
      {nftsToShow.length > 0 ? (
        <>
          <Grid
            gridGap="16px"
            gridTemplateColumns={['1fr', null, 'repeat(3, 1fr)', null, 'repeat(4, 1fr)']}
            alignItems="start"
          >
            {nftsToShow.map((nft) => {
              const currentAskPriceAsNumber = nft.marketData && parseFloat(nft.marketData.currentAskPrice)

              return (
                <CollectibleLinkCard
                  key={nft.tokenId}
                  nft={nft}
                  currentAskPrice={currentAskPriceAsNumber > 0 ? currentAskPriceAsNumber : undefined}
                />
              )
            })}
          </Grid>
          <Flex mt="60px" mb="12px" justifyContent="center">
            {collectionNfts.length > numToShow && (
              <Button onClick={handleLoadMore} scale="sm">
                {t('Load more')}
              </Button>
            )}
          </Flex>
        </>
      ) : (
        <Flex alignItems="center" py="48px" flexDirection="column">
          <BunnyPlaceholderIcon width="96px" mb="24px" />
          <Text fontWeight={600}>{t('No NFTs found')}</Text>
        </Flex>
      )}
    </>
  )
}

export default FilteredCollectionNfts
