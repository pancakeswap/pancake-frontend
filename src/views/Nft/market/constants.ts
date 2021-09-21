import { collections } from 'config/constants/nfts'
import { CollectionKey } from 'config/constants/nfts/types'
import { getAddress } from 'utils/addressHelpers'

export const nftsBaseUrl = '/nfts'

// @TODO This will be removed when more collections are added
export const pancakeBunniesAddress = getAddress(collections[CollectionKey.PANCAKE].address)

// @TODO Remove after the V1
export const TMP_SEE_ALL_LINK = `${nftsBaseUrl}/collections/${pancakeBunniesAddress}`
