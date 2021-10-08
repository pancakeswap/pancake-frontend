import React, { useEffect, useState } from 'react'
import { AutoRenewIcon, Button, Flex, Grid } from '@pancakeswap/uikit'
import { useAppDispatch } from 'state'
import { useGetNftFilterLoadingState, useNftsFromCollection } from 'state/nftMarket/hooks'
import { Collection, NftFilterLoadingState } from 'state/nftMarket/types'
import { fetchNftsFromCollections } from 'state/nftMarket/reducer'
import { useTranslation } from 'contexts/Localization'
import GridPlaceholder from '../../components/GridPlaceholder'
import { CollectibleLinkCard } from '../../components/CollectibleCard'
import { REQUEST_SIZE } from '../config'

interface CollectionNftsProps {
  collection: Collection
}

const CollectionNfts: React.FC<CollectionNftsProps> = ({ collection }) => {
  const { totalSupply, address: collectionAddress } = collection
  const [page, setPage] = useState(1)
  const { t } = useTranslation()
  const collectionNfts = useNftsFromCollection(collectionAddress)
  const nftFilterLoadingState = useGetNftFilterLoadingState()
  const isFetching = nftFilterLoadingState === NftFilterLoadingState.LOADING
  const dispatch = useAppDispatch()

  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1)
  }

  useEffect(() => {
    dispatch(
      fetchNftsFromCollections({
        collectionAddress,
        page,
        size: REQUEST_SIZE,
      }),
    )
  }, [page, collectionAddress, dispatch])

  if (!collectionNfts || collectionNfts?.length === 0) {
    return <GridPlaceholder numItems={REQUEST_SIZE} />
  }

  return (
    <>
      <Grid
        gridGap="16px"
        gridTemplateColumns={['1fr', null, 'repeat(3, 1fr)', null, 'repeat(4, 1fr)']}
        alignItems="start"
      >
        {collectionNfts.map((nft) => {
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
        {collectionNfts?.length < Number(totalSupply) && (
          <Button
            onClick={handleLoadMore}
            scale="sm"
            endIcon={isFetching ? <AutoRenewIcon spin color="currentColor" /> : undefined}
          >
            {isFetching ? t('Loading') : t('Load more')}
          </Button>
        )}
      </Flex>
    </>
  )
}

export default CollectionNfts
