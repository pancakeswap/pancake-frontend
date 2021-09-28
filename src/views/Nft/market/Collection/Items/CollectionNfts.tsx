import React, { useEffect, useState } from 'react'
import { Grid } from '@pancakeswap/uikit'
import { getAddress } from '@ethersproject/address'
import orderBy from 'lodash/orderBy'
import { useAppDispatch } from 'state'
import { useNftsFromCollection } from 'state/nftMarket/hooks'
import { NftToken, Collection } from 'state/nftMarket/types'
import { fetchNftsFromCollections } from 'state/nftMarket/reducer'
import {
  getAllPancakeBunniesLowestPrice,
  getAllPancakeBunniesRecentUpdatedAt,
  getNftsFromCollectionApi,
} from 'state/nftMarket/helpers'
import GridPlaceholder from '../../components/GridPlaceholder'
import { CollectibleLinkCard } from '../../components/CollectibleCard'
import { pancakeBunniesAddress } from '../../constants'

interface CollectionNftsProps {
  collection: Collection
  sortBy?: string
}

const CollectionNfts: React.FC<CollectionNftsProps> = ({ collection, sortBy = 'updatedAt' }) => {
  const { address } = collection
  const [allPancakeBunnyNfts, setAllPancakeBunnyNfts] = useState<NftToken[]>(null)
  const checksummedAddress = getAddress(address)
  const nfts = useNftsFromCollection(checksummedAddress)
  const dispatch = useAppDispatch()

  const isPBCollection = address === pancakeBunniesAddress

  useEffect(() => {
    dispatch(fetchNftsFromCollections(checksummedAddress))
  }, [checksummedAddress, dispatch])

  useEffect(() => {
    const fetchPancakeBunnies = async () => {
      // In order to not define special TS type just for PancakeBunnies display we're hacking a little bit into NftToken type.
      // On this page we just want to display all bunnies with thier lowest prices and updates on the market
      // Since some bunnies might not be on the market at all, we don't refer to the redux nfts state (which stores NftToken with actual token ids)
      // We merely request from API all available bunny ids with their metadata and query subgraph for lowest price and latest updates.
      const { data } = await getNftsFromCollectionApi(pancakeBunniesAddress)
      const bunnyIds = Object.keys(data)
      const lowestPrices = await getAllPancakeBunniesLowestPrice(bunnyIds)
      const latestUpdates = await getAllPancakeBunniesRecentUpdatedAt(bunnyIds)
      const allBunnies: NftToken[] = bunnyIds.map((bunnyId) => {
        return {
          // tokenId here is just a dummy one to satisfy TS. TokenID does not play any role in gird display below
          tokenId: data[bunnyId].name,
          name: data[bunnyId].name,
          description: data[bunnyId].description,
          collectionAddress: pancakeBunniesAddress,
          collectionName: data[bunnyId].collection.name,
          image: data[bunnyId].image,
          attributes: [
            {
              traitType: 'bunnyId',
              value: bunnyId,
              displayType: null,
            },
          ],
          meta: {
            currentAskPrice: lowestPrices[bunnyId],
            updatedAt: latestUpdates[bunnyId],
          },
        }
      })
      setAllPancakeBunnyNfts(allBunnies)
    }
    if (isPBCollection) {
      fetchPancakeBunnies()
    }
  }, [isPBCollection])

  let nftsToShow = isPBCollection ? allPancakeBunnyNfts : nfts.filter((nft) => nft.marketData.isTradable)

  if (!nftsToShow) {
    return <GridPlaceholder />
  }

  nftsToShow = orderBy(nftsToShow, (nft) => (isPBCollection ? nft.meta[sortBy] : Number(nft.marketData[sortBy])), [
    sortBy === 'currentAskPrice' ? 'asc' : 'desc',
  ])

  return (
    <Grid
      gridGap="16px"
      gridTemplateColumns={['1fr', null, 'repeat(3, 1fr)', null, 'repeat(4, 1fr)']}
      alignItems="start"
    >
      {nftsToShow.map((nft) => {
        return <CollectibleLinkCard key={`${nft.tokenId}-${nft.collectionName}`} nft={nft} />
      })}
    </Grid>
  )
}

export default CollectionNfts
