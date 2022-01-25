import React, { useState } from 'react'
import orderBy from 'lodash/orderBy'
import { BunnyPlaceholderIcon, Button, Flex, Grid, Text } from '@pancakeswap/uikit'
import {
  useGetNftFilterLoadingState,
  useGetNftOrdering,
  useGetNftShowOnlyOnSale,
  useNftsFromCollection,
} from 'state/nftMarket/hooks'
import { Collection } from 'state/nftMarket/types'
import { useTranslation } from 'contexts/Localization'
import { FetchStatus } from 'config/constants/types'
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
  const selectedOrder = useGetNftOrdering(collectionAddress)
  const showOnlyNftsOnSale = useGetNftShowOnlyOnSale(collectionAddress)
  const collectionNfts = useNftsFromCollection(collectionAddress)
  const nftFilterLoadingState = useGetNftFilterLoadingState(collectionAddress)

  const handleLoadMore = () => {
    setNumToShow((prevNumToShow) => prevNumToShow + REQUEST_SIZE)
  }

  if (nftFilterLoadingState === FetchStatus.Fetching) {
    return <GridPlaceholder />
  }

  const orderedNfts = collectionNfts
    ? orderBy(
        collectionNfts,
        (nft) => {
          if (selectedOrder.field === 'currentAskPrice') {
            const currentAskPriceAsNumber = nft.marketData?.currentAskPrice
              ? parseFloat(nft.marketData?.currentAskPrice)
              : 0
            if (currentAskPriceAsNumber > 0) {
              return parseFloat(nft.marketData.currentAskPrice)
            }
            return selectedOrder.direction === 'asc' ? Infinity : -Infinity
          }
          if (selectedOrder.field === 'tokenId') {
            const tokenIdNumber = Number(nft.tokenId)
            return Number.isFinite(tokenIdNumber) ? tokenIdNumber : 0
          }
          // recently listed sorting
          return nft.marketData ? parseInt(nft.marketData[selectedOrder.field], 10) : 0
        },
        selectedOrder.direction,
      )
    : []

  const filteredNfts = showOnlyNftsOnSale ? orderedNfts.filter((nft) => nft.marketData?.isTradable) : orderedNfts

  const nftsToShow = filteredNfts.slice(0, numToShow)

  return (
    <>
      <Flex p="16px">
        <Text bold>
          {filteredNfts.length} {t('Results')}
        </Text>
      </Flex>
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
