import { Activity, NftToken, TokenIdWithCollectionAddress } from 'state/nftMarket/types'
import { getNftsFromCollectionApi, getNftsFromDifferentCollectionsApi } from 'state/nftMarket/helpers'
import uniqBy from 'lodash/uniqBy'
import { isAddress } from 'utils'
import { pancakeBunniesAddress } from '../../constants'

export const fetchActivityNftMetadata = async (activities: Activity[]): Promise<NftToken[]> => {
  const hasPBCollections = activities.some(
    (activity) => isAddress(activity.nft.collection.id) === pancakeBunniesAddress,
  )

  const activityNftTokenIds = uniqBy(
    activities
      .filter((activity) => activity.nft.collection.id.toLowerCase() !== pancakeBunniesAddress.toLowerCase())
      .map((activity): TokenIdWithCollectionAddress => {
        return { tokenId: activity.nft.tokenId, collectionAddress: activity.nft.collection.id }
      }),
    (tokenWithCollectionAddress) =>
      `${tokenWithCollectionAddress.tokenId}#${tokenWithCollectionAddress.collectionAddress}`,
  )

  const [bunniesMetadata, nfts] = await Promise.all([
    hasPBCollections ? getNftsFromCollectionApi(pancakeBunniesAddress) : Promise.resolve(null),
    getNftsFromDifferentCollectionsApi(activityNftTokenIds),
  ])

  const pbNfts = bunniesMetadata
    ? activities
        .filter((activity) => isAddress(activity.nft.collection.id) === pancakeBunniesAddress)
        .map((activity) => {
          const { name: collectionName } = bunniesMetadata.data[activity.nft.otherId].collection
          return {
            ...bunniesMetadata.data[activity.nft.otherId],
            tokenId: activity.nft.tokenId,
            attributes: [{ traitType: 'bunnyId', value: activity.nft.otherId }],
            collectionAddress: activity.nft.collection.id,
            collectionName,
          }
        })
    : []

  return nfts.concat(pbNfts)
}
