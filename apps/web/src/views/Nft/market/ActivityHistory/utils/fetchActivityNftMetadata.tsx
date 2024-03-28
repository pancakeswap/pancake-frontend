import partition from 'lodash/partition'
import uniqBy from 'lodash/uniqBy'
import { getNftsFromCollectionApi, getNftsFromDifferentCollectionsApi } from 'state/nftMarket/helpers'
import { Activity, ApiSingleTokenData, NftToken, TokenIdWithCollectionAddress } from 'state/nftMarket/types'
import { safeGetAddress } from 'utils'
import { Address } from 'viem'
import { pancakeBunniesAddress } from '../../constants'

export const fetchActivityNftMetadata = async (activities: Activity[]): Promise<NftToken[]> => {
  const [pbCollections, nonPBCollections] = partition(
    activities,
    (activity) => safeGetAddress(activity.nft?.collection.id) === safeGetAddress(pancakeBunniesAddress),
  )

  const activityNftTokenIds = uniqBy(
    nonPBCollections.map((activity): TokenIdWithCollectionAddress => {
      return { tokenId: activity.nft?.tokenId, collectionAddress: activity.nft?.collection.id as Address }
    }),
    (tokenWithCollectionAddress) =>
      `${tokenWithCollectionAddress.tokenId}#${tokenWithCollectionAddress.collectionAddress}`,
  )

  const [bunniesMetadata, nfts] = await Promise.all([
    pbCollections.length ? getNftsFromCollectionApi(pancakeBunniesAddress) : Promise.resolve(null),
    getNftsFromDifferentCollectionsApi(activityNftTokenIds),
  ])

  const pbNfts = bunniesMetadata
    ? pbCollections.map((activity) => {
        let collectionName = ''
        let data: ApiSingleTokenData = {} as ApiSingleTokenData
        if (activity.nft?.otherId) {
          collectionName = bunniesMetadata.data[activity.nft.otherId]?.collection.name
          data = bunniesMetadata.data[activity.nft.otherId]
        }
        return {
          ...data,
          tokenId: activity.nft?.tokenId,
          attributes: [{ traitType: 'bunnyId', value: activity.nft?.otherId }],
          collectionAddress: activity.nft?.collection.id,
          collectionName,
        } as unknown as NftToken
      })
    : []

  return nfts.concat(pbNfts)
}
