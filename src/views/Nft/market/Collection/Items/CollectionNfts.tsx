import React, { useEffect, useRef } from 'react'
import {
  ArrowBackIcon,
  ArrowForwardIcon,
  AutoRenewIcon,
  BunnyPlaceholderIcon,
  Flex,
  Grid,
  Text,
} from '@pancakeswap/uikit'
import { getAddress } from '@ethersproject/address'
import isEmpty from 'lodash/isEmpty'
import { useAppDispatch } from 'state'
import {
  useGetNftFilterCurrentPage,
  useGetNftFilterLoadingState,
  useGetNftFilters,
  useGetNftTotalFilterResults,
  useNftsFromCollection,
} from 'state/nftMarket/hooks'
import { Collection, NftFilterLoadingState } from 'state/nftMarket/types'
import { fetchNftsFromCollections, setNftFilterCurrentPage } from 'state/nftMarket/reducer'
import { useTranslation } from 'contexts/Localization'
import GridPlaceholder from '../../components/GridPlaceholder'
import { CollectibleLinkCard } from '../../components/CollectibleCard'
import { Arrow, PageButtons } from '../../components/PaginationButtons'

interface CollectionNftsProps {
  collection: Collection
  scrollToTop: () => void
}

const REQUEST_SIZE = 100
const MAX_ITEMS_PER_PAGE = 100

const CollectionNfts: React.FC<CollectionNftsProps> = ({ collection, scrollToTop }) => {
  const dispatch = useAppDispatch()
  const scrollEl = useRef<HTMLDivElement>(null)
  const { t } = useTranslation()

  const { address, totalSupply: collectionTotalSupply } = collection
  const checksummedAddress = getAddress(address)
  const currentPage = useGetNftFilterCurrentPage()
  const nftFilters = useGetNftFilters(checksummedAddress)
  const totalFilterResults = useGetNftTotalFilterResults()
  const nftsFromCollection = useNftsFromCollection(checksummedAddress)
  const nftFilterLoadingState = useGetNftFilterLoadingState()

  const hasFilter = !isEmpty(nftFilters?.attributes)
  const totalSupply = hasFilter ? totalFilterResults : Number(collectionTotalSupply)
  const maxPage = Math.ceil(totalSupply / MAX_ITEMS_PER_PAGE)
  const shouldFetchMoreNfts =
    nftsFromCollection?.length > 0 && nftsFromCollection.length <= currentPage * MAX_ITEMS_PER_PAGE && !hasFilter
  const isArrowBackDisabled = currentPage === 1
  const isArrowForwardDisabled = currentPage === maxPage || shouldFetchMoreNfts
  const requestPage = Math.ceil(nftsFromCollection?.length / REQUEST_SIZE) + 1

  const nftsSlice = nftsFromCollection
    ? nftsFromCollection.slice(MAX_ITEMS_PER_PAGE * (currentPage - 1), MAX_ITEMS_PER_PAGE * currentPage)
    : []

  useEffect(() => {
    // First fetch
    dispatch(
      fetchNftsFromCollections({
        collectionAddress: checksummedAddress,
        page: 1,
        size: REQUEST_SIZE,
      }),
    )
  }, [checksummedAddress, dispatch])

  useEffect(() => {
    // Additional fetches
    const fetchMoreNftsFromCollections = () => {
      dispatch(
        fetchNftsFromCollections({
          collectionAddress: checksummedAddress,
          page: requestPage,
          size: REQUEST_SIZE,
        }),
      )
    }

    // NB: TRAIT FILTERS - When trait filter is active, should probably prevent this from firing
    if (shouldFetchMoreNfts) {
      fetchMoreNftsFromCollections()
    }
  }, [requestPage, currentPage, checksummedAddress, shouldFetchMoreNfts, dispatch])

  if (nftFilterLoadingState === NftFilterLoadingState.LOADING) {
    return <GridPlaceholder />
  }

  return (
    <>
      {nftsSlice.length > 0 ? (
        <Grid
          ref={scrollEl}
          gridGap="16px"
          gridTemplateColumns={['1fr', null, 'repeat(3, 1fr)', null, 'repeat(4, 1fr)']}
          alignItems="start"
        >
          {nftsSlice.map((nft) => {
            const currentAskPrice = nft.marketData?.isTradable ? parseFloat(nft.marketData.currentAskPrice) : undefined
            return (
              <CollectibleLinkCard
                key={`${nft.tokenId}-${nft.collectionName}`}
                nft={nft}
                currentAskPrice={currentAskPrice}
              />
            )
          })}
        </Grid>
      ) : (
        <Flex alignItems="center" justifyContent="center" py="48px" flexDirection="column">
          <BunnyPlaceholderIcon width="96px" mb="24px" />
          <Text textAlign="center" fontWeight="bold" mb="8px">
            {t('No NFTs found')}
          </Text>
        </Flex>
      )}
      {nftsFromCollection?.length > MAX_ITEMS_PER_PAGE && (
        <Flex mt="24px">
          <PageButtons>
            <Arrow
              onClick={() => {
                dispatch(setNftFilterCurrentPage(isArrowBackDisabled ? currentPage : currentPage - 1))
              }}
            >
              <ArrowBackIcon
                color={isArrowBackDisabled ? 'textDisabled' : 'primary'}
                cursor={isArrowBackDisabled ? 'not-allowed' : 'pointer'}
              />
            </Arrow>
            <Text>{t('Page %page% of %maxPage%', { page: currentPage, maxPage })}</Text>
            <Arrow
              onClick={() => {
                if (!isArrowForwardDisabled) {
                  scrollToTop()
                  dispatch(setNftFilterCurrentPage(currentPage + 1))
                }
              }}
            >
              {shouldFetchMoreNfts ? (
                <AutoRenewIcon spin color="textDisabled" cursor="not-allowed" />
              ) : (
                <ArrowForwardIcon
                  color={isArrowForwardDisabled ? 'textDisabled' : 'primary'}
                  cursor={isArrowForwardDisabled ? 'not-allowed' : 'pointer'}
                />
              )}
            </Arrow>
          </PageButtons>
        </Flex>
      )}
    </>
  )
}

export default CollectionNfts
