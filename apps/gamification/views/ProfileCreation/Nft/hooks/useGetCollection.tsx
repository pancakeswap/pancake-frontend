import { useQuery } from '@tanstack/react-query'
import { safeGetAddress } from 'utils'
import { getCollection } from 'views/ProfileCreation/Nft/helpers'
import { Collection } from '../type'

export const useGetCollection = (collectionAddress: string | undefined): Collection | undefined => {
  const checksummedCollectionAddress = safeGetAddress(collectionAddress) || ''
  const { data } = useQuery({
    queryKey: ['nftMarket', 'collections', checksummedCollectionAddress?.toLowerCase()],
    queryFn: async () => getCollection(checksummedCollectionAddress),
    enabled: Boolean(checksummedCollectionAddress),
  })
  const collectionObject = data ?? {}
  return collectionObject[checksummedCollectionAddress]
}
