import { useQuery } from '@tanstack/react-query'
import { TFetchStatus } from 'config/constants/types'
import { useAtom } from 'jotai'
import isEmpty from 'lodash/isEmpty'
import shuffle from 'lodash/shuffle'
import { safeGetAddress } from 'utils'
import { getPancakeProfileAddress } from 'utils/addressHelpers'

import fromPairs from 'lodash/fromPairs'
import { erc721Abi } from 'viem'
import { useReadContracts } from '@pancakeswap/wagmi'
import { nftMarketActivityFiltersAtom, nftMarketFiltersAtom, tryVideoNftMediaAtom } from './atoms'
import { getCollection, getCollections } from './helpers'
import { ApiCollections, Collection, MarketEvent, NftAttribute, NftToken } from './types'

const DEFAULT_NFT_ORDERING = { field: 'currentAskPrice', direction: 'asc' as 'asc' | 'desc' }
const DEFAULT_NFT_ACTIVITY_FILTER = { typeFilters: [], collectionFilters: [] }
const EMPTY_OBJECT = {}

export const useGetCollections = (): { data: ApiCollections; status: TFetchStatus } => {
  const { data, status } = useQuery({
    queryKey: ['nftMarket', 'collections'],
    queryFn: async () => getCollections(),
  })
  const collections = data ?? ({} as ApiCollections)
  return { data: collections, status }
}

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

export const useGetShuffledCollections = (): { data: Collection[]; status: 'pending' | 'success' | 'error' } => {
  const { data } = useQuery({
    queryKey: ['nftMarket', 'collections'],
    queryFn: async () => getCollections(),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  })
  const collections = data ?? ({} as ApiCollections)
  const { data: shuffledCollections = [], status } = useQuery({
    queryKey: ['nftMarket', 'shuffledCollections'],
    queryFn: () => shuffle(collections),
    enabled: Boolean(collections && !isEmpty(collections)),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  })
  return { data: shuffledCollections, status }
}

export const useApprovalNfts = (nftsInWallet: NftToken[]) => {
  const { data } = useReadContracts({
    contracts: nftsInWallet.map(
      (f) =>
        ({
          abi: erc721Abi,
          address: f.collectionAddress,
          functionName: 'getApproved',
          args: [BigInt(f.tokenId)],
        } as const),
    ),
    watch: true,
  })

  const profileAddress = getPancakeProfileAddress()

  const approvedTokenIds = Array.isArray(data)
    ? fromPairs(
        data
          .flat()
          .map((result, index) => [
            nftsInWallet[index].tokenId,
            profileAddress.toLowerCase() === result?.result?.toLowerCase(),
          ]),
      )
    : null

  return { data: approvedTokenIds }
}

export const useGetNftFilters = (collectionAddress?: string): Readonly<Record<string, NftAttribute>> => {
  const [nftMarketFilters] = useAtom(nftMarketFiltersAtom)
  if (!collectionAddress) return EMPTY_OBJECT
  return nftMarketFilters[collectionAddress]?.activeFilters ?? EMPTY_OBJECT
}

export const useGetNftOrdering = (collectionAddress?: string) => {
  const [nftMarketFilters] = useAtom(nftMarketFiltersAtom)
  if (!collectionAddress) return DEFAULT_NFT_ORDERING
  return nftMarketFilters[collectionAddress]?.ordering ?? DEFAULT_NFT_ORDERING
}

export const useGetNftShowOnlyOnSale = (collectionAddress?: string) => {
  const [nftMarketFilters] = useAtom(nftMarketFiltersAtom)
  if (!collectionAddress) return true
  return nftMarketFilters[collectionAddress]?.showOnlyOnSale ?? true
}

export const useTryVideoNftMedia = () => {
  const [tryVideoNftMedia] = useAtom(tryVideoNftMediaAtom)
  return tryVideoNftMedia ?? true
}

export const useGetNftActivityFilters = (
  collectionAddress: string,
): { typeFilters: MarketEvent[]; collectionFilters: string[] } => {
  const [nftMarketActivityFilters] = useAtom(nftMarketActivityFiltersAtom)
  return nftMarketActivityFilters[collectionAddress] ?? DEFAULT_NFT_ACTIVITY_FILTER
}
