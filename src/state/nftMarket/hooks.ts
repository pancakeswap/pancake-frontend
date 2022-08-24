import { useMemo } from 'react'
import { isAddress } from 'utils'
import { FetchStatus } from 'config/constants/types'
import erc721Abi from 'config/abi/erc721.json'
import { useSWRMulticall } from 'hooks/useSWRContract'
import { getPancakeProfileAddress } from 'utils/addressHelpers'
import useSWR from 'swr'
import useSWRImmutable from 'swr/immutable'
import isEmpty from 'lodash/isEmpty'
import shuffle from 'lodash/shuffle'

import fromPairs from 'lodash/fromPairs'
import { ApiCollections, NftToken, Collection, NftAttribute, MarketEvent } from './types'
import { getCollection, getCollections } from './helpers'
import { useSessionStorageListener } from './storage'

const DEFAULT_NFT_ORDERING = { field: 'currentAskPrice', direction: 'asc' as 'asc' | 'desc' }
const DEFAULT_NFT_ACTIVITY_FILTER = { typeFilters: [], collectionFilters: [] }
const EMPTY_OBJECT = {}

export const useGetCollections = (): { data: ApiCollections; status: FetchStatus } => {
  const { data, status } = useSWR(['nftMarket', 'collections'], async () => getCollections())
  const collections = data ?? ({} as ApiCollections)
  return { data: collections, status }
}

export const useGetCollection = (collectionAddress: string): Collection | undefined => {
  const checksummedCollectionAddress = isAddress(collectionAddress) || ''
  const { data } = useSWR(
    checksummedCollectionAddress ? ['nftMarket', 'collections', checksummedCollectionAddress.toLowerCase()] : null,
    async () => getCollection(checksummedCollectionAddress),
  )
  const collectionObject = data ?? {}
  return collectionObject[checksummedCollectionAddress]
}

export const useGetShuffledCollections = (): { data: Collection[]; status: FetchStatus } => {
  const { data } = useSWRImmutable(['nftMarket', 'collections'], async () => getCollections())
  const collections = data ?? ({} as ApiCollections)
  const { data: shuffledCollections, status } = useSWRImmutable(
    !isEmpty(collections) ? ['nftMarket', 'shuffledCollections'] : null,
    () => {
      return shuffle(collections)
    },
  )
  return { data: shuffledCollections, status }
}

export const useApprovalNfts = (nftsInWallet: NftToken[]) => {
  const nftApprovalCalls = useMemo(
    () =>
      nftsInWallet.map((nft: NftToken) => {
        const { tokenId, collectionAddress } = nft

        return {
          address: collectionAddress,
          name: 'getApproved',
          params: [tokenId],
        }
      }),
    [nftsInWallet],
  )

  const { data } = useSWRMulticall(erc721Abi, nftApprovalCalls)
  const profileAddress = getPancakeProfileAddress()

  const approvedTokenIds = Array.isArray(data)
    ? fromPairs(data.flat().map((address, index) => [nftsInWallet[index].tokenId, profileAddress === address]))
    : null

  return { data: approvedTokenIds }
}

export const useGetNftFilters = (collectionAddress: string): Readonly<Record<string, NftAttribute>> => {
  useSessionStorageListener('nftMarketFilters')
  const rawNftMarketFilters = sessionStorage?.getItem('nftMarketFilters')
  const collectionFilters = rawNftMarketFilters ? JSON.parse(rawNftMarketFilters) : {}
  return collectionFilters[collectionAddress]?.activeFilters ?? EMPTY_OBJECT
}

export const useGetNftOrdering = (collectionAddress: string) => {
  useSessionStorageListener('nftMarketFilters')
  const rawNftMarketFilters = sessionStorage?.getItem('nftMarketFilters')
  const collectionFilters = rawNftMarketFilters ? JSON.parse(rawNftMarketFilters) : {}
  return collectionFilters[collectionAddress]?.ordering ?? DEFAULT_NFT_ORDERING
}

export const useGetNftShowOnlyOnSale = (collectionAddress: string) => {
  useSessionStorageListener('nftMarketFilters')
  const rawNftMarketFilters = sessionStorage?.getItem('nftMarketFilters')
  const collectionFilters = rawNftMarketFilters ? JSON.parse(rawNftMarketFilters) : {}
  return collectionFilters[collectionAddress]?.showOnlyOnSale ?? true
}

export const useTryVideoNftMedia = () => {
  useSessionStorageListener('nftMarketTryVideoNftMedia')
  const rawNftMarketTryVideoNftMedia = sessionStorage?.getItem('nftMarketTryVideoNftMedia')
  return rawNftMarketTryVideoNftMedia ? JSON.parse(rawNftMarketTryVideoNftMedia) : true
}

export const useGetNftActivityFilters = (
  collectionAddress: string,
): { typeFilters: MarketEvent[]; collectionFilters: string[] } => {
  useSessionStorageListener('nftMarketActivityFilters')
  const rawNftMarketActivityFilters = sessionStorage?.getItem('nftMarketActivityFilters')
  const collectionFilters = rawNftMarketActivityFilters ? JSON.parse(rawNftMarketActivityFilters) : {}
  return collectionFilters[collectionAddress] ?? DEFAULT_NFT_ACTIVITY_FILTER
}
