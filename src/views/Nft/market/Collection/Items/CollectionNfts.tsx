import React, { useEffect, useState, useRef } from 'react'
import { ArrowBackIcon, ArrowForwardIcon, AutoRenewIcon, Flex, Grid, Text } from '@pancakeswap/uikit'
import { getAddress } from '@ethersproject/address'
import { useAppDispatch } from 'state'
import { useNftsFromCollection } from 'state/nftMarket/hooks'
import { Collection, NftToken } from 'state/nftMarket/types'
import { fetchNftsFromCollections } from 'state/nftMarket/reducer'
import { useTranslation } from 'contexts/Localization'
import GridPlaceholder from '../../components/GridPlaceholder'
import { CollectibleLinkCard } from '../../components/CollectibleCard'
import { Arrow, PageButtons } from '../../components/PaginationButtons'

interface CollectionNftsProps {
  collection: Collection
}

const REQUEST_SIZE = 100
const MAX_ITEMS_PER_PAGE = 100

const CollectionNfts: React.FC<CollectionNftsProps> = ({ collection }) => {
  const dispatch = useAppDispatch()
  const scrollEl = useRef<HTMLDivElement>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [maxPage, setMaxPages] = useState(1)
  const [nftsSlice, setNftsSlice] = useState<NftToken[]>([])
  const { t } = useTranslation()

  const { address, totalSupply } = collection

  const checksummedAddress = getAddress(address)

  const nftsFromCollection = useNftsFromCollection(checksummedAddress)

  const shouldFetchMoreNfts = nftsFromCollection?.length <= currentPage * MAX_ITEMS_PER_PAGE
  const isArrowBackDisabled = currentPage === 1
  const isArrowForwardDisabled = currentPage === maxPage || shouldFetchMoreNfts

  const scrollToTop = (): void => {
    scrollEl.current.scrollIntoView({
      behavior: 'smooth',
    })
  }

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
      const requestPage = Math.ceil(nftsFromCollection.length / REQUEST_SIZE) + 1
      dispatch(
        fetchNftsFromCollections({
          collectionAddress: checksummedAddress,
          page: requestPage,
          size: REQUEST_SIZE,
        }),
      )
    }

    // NB: TRAIT FILTERS - When trait filter is active, should probably prevent this from firing
    if (nftsFromCollection?.length > 0 && shouldFetchMoreNfts) {
      fetchMoreNftsFromCollections()
    }
  }, [nftsFromCollection, currentPage, checksummedAddress, shouldFetchMoreNfts, dispatch])

  useEffect(() => {
    const getMaxPages = () => {
      // NB: TRAIT FILTERS - changing the `totalSupply` here to the length of the data returned by the traits res should work well for pure FE pagination.
      const max = Math.ceil(Number(totalSupply) / MAX_ITEMS_PER_PAGE)
      setMaxPages(max)
    }

    if (totalSupply) {
      getMaxPages()
    }
  }, [totalSupply])

  // Slice sorted data to paginate in FE
  useEffect(() => {
    const getActivitiesSlice = () => {
      const slice = nftsFromCollection.slice(MAX_ITEMS_PER_PAGE * (currentPage - 1), MAX_ITEMS_PER_PAGE * currentPage)
      setNftsSlice(slice)
    }

    if (nftsFromCollection?.length > 0) {
      getActivitiesSlice()
    }
  }, [nftsFromCollection, currentPage])

  if (!nftsSlice.length) {
    return <GridPlaceholder />
  }

  return (
    <>
      <Grid
        ref={scrollEl}
        gridGap="16px"
        gridTemplateColumns={['1fr', null, 'repeat(3, 1fr)', null, 'repeat(4, 1fr)']}
        alignItems="start"
      >
        {nftsSlice.map((nft) => {
          return <CollectibleLinkCard key={`${nft.tokenId}-${nft.collectionName}`} nft={nft} />
        })}
      </Grid>
      {nftsFromCollection?.length > MAX_ITEMS_PER_PAGE && (
        <Flex mt="24px">
          <PageButtons>
            <Arrow
              onClick={() => {
                setCurrentPage(isArrowBackDisabled ? currentPage : currentPage - 1)
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
                  setCurrentPage(currentPage + 1)
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
