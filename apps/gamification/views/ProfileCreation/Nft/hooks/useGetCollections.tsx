import { useQuery } from '@tanstack/react-query'
import { TFetchStatus } from 'config/constants/types'
import { getCollections } from 'views/ProfileCreation/Nft/helpers'
import { ApiCollections } from '../type'

export const useGetCollections = (): { data: ApiCollections; status: TFetchStatus } => {
  const { data, status } = useQuery({
    queryKey: ['nftMarket', 'collections'],
    queryFn: async () => getCollections(),
  })
  const collections = data ?? ({} as ApiCollections)
  return { data: collections, status }
}
