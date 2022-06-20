import { useState, useEffect } from 'react'
import {
  getAllPancakeBunniesLowestPrice,
  getAllPancakeBunniesRecentUpdatedAt,
  getNftsFromCollectionApi,
} from 'state/nftMarket/helpers'
import { NftToken } from 'state/nftMarket/types'
import { pancakeBunniesAddress } from '../constants'

// If collection is PancakeBunnies - gets all available bunnies, otherwise - null
const useAllPancakeBunnyNfts = (collectionAddress: string) => {
  const [allPancakeBunnyNfts, setAllPancakeBunnyNfts] = useState<NftToken[]>(null)

  const isPBCollection = collectionAddress === pancakeBunniesAddress

  useEffect(() => {
    const fetchPancakeBunnies = async () => {
      // In order to not define special TS type just for PancakeBunnies display we're hacking a little bit into NftToken type.
      // On this page we just want to display all bunnies with their lowest prices and updates on the market
      // Since some bunnies might not be on the market at all, we don't refer to the redux nfts state (which stores NftToken with actual token ids)
      // We merely request from API all available bunny ids with their metadata and query subgraph for lowest price and latest updates.
      const response = await getNftsFromCollectionApi(pancakeBunniesAddress)
      if (!response) return
      const { data } = response
      const bunnyIds = Object.keys(data)
      const [lowestPrices, latestUpdates] = await Promise.all([
        getAllPancakeBunniesLowestPrice(bunnyIds),
        getAllPancakeBunniesRecentUpdatedAt(bunnyIds),
      ])
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
    if (isPBCollection && !allPancakeBunnyNfts) {
      fetchPancakeBunnies()
    }
  }, [isPBCollection, allPancakeBunnyNfts])

  return allPancakeBunnyNfts
}

export default useAllPancakeBunnyNfts
