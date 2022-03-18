import { PancakeCollectionKey } from 'config/constants/nftsCollections/types'
import pancakeCollections from 'config/constants/nftsCollections'
import { getAddress } from 'utils/addressHelpers'

export const nftsBaseUrl = '/nfts'
export const pancakeBunniesAddress = getAddress(pancakeCollections[PancakeCollectionKey.PANCAKE].address)
export const pancakeSquadAddress = getAddress(pancakeCollections[PancakeCollectionKey.SQUAD].address)
