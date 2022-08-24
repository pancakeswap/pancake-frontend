import { NftFilter, NftActivityFilter, MarketEvent, NftAttribute } from 'state/nftMarket/types'
import { useAtom } from 'jotai'
import { nftMarketFiltersAtom, nftMarketActivityFiltersAtom, tryVideoNftMediaAtom } from 'state/nftMarket/atoms'
import { useCallback } from 'react'

const initialNftFilterState: NftFilter = {
  activeFilters: {},
  showOnlyOnSale: true,
  ordering: {
    field: 'currentAskPrice',
    direction: 'asc',
  },
}

const initialNftActivityFilterState: NftActivityFilter = {
  typeFilters: [],
  collectionFilters: [],
}

export function useNftStorage() {
  const [nftMarketFilters, setNftMarketFilters] = useAtom(nftMarketFiltersAtom)
  const [nftMarketActivityFilters, setNftMarketActivityFilters] = useAtom(nftMarketActivityFiltersAtom)
  const [tryVideoNftMedia, setTryVideoNftMedia] = useAtom(tryVideoNftMediaAtom)

  const addActivityTypeFilters = useCallback(
    ({ collection, field }: { collection: string; field: MarketEvent }) => {
      if (nftMarketActivityFilters[collection]) {
        nftMarketActivityFilters[collection].typeFilters.push(field)
      } else {
        nftMarketActivityFilters[collection] = {
          ...initialNftActivityFilterState,
          typeFilters: [field],
        }
      }
      setNftMarketActivityFilters({ ...nftMarketActivityFilters })
    },
    [setNftMarketActivityFilters, nftMarketActivityFilters],
  )

  const addActivityCollectionFilters = useCallback(
    ({ collection }: { collection: string }) => {
      if (nftMarketActivityFilters['']) {
        nftMarketActivityFilters[''].collectionFilters.push(collection)
      } else {
        nftMarketActivityFilters[''] = {
          ...initialNftActivityFilterState,
          collectionFilters: [collection],
        }
      }
      setNftMarketActivityFilters({ ...nftMarketActivityFilters })
    },
    [setNftMarketActivityFilters, nftMarketActivityFilters],
  )

  const removeActivityTypeFilters = useCallback(
    ({ collection, field }: { collection: string; field: MarketEvent }) => {
      if (nftMarketActivityFilters[collection]) {
        nftMarketActivityFilters[collection].typeFilters = nftMarketActivityFilters[collection].typeFilters.filter(
          (activeFilter) => activeFilter !== field,
        )
      }
      setNftMarketActivityFilters({ ...nftMarketActivityFilters })
    },
    [setNftMarketActivityFilters, nftMarketActivityFilters],
  )

  const removeActivityCollectionFilters = useCallback(
    ({ collection }: { collection: string }) => {
      if (nftMarketActivityFilters['']) {
        nftMarketActivityFilters[collection].collectionFilters = nftMarketActivityFilters[
          collection
        ].collectionFilters.filter((activeFilter) => activeFilter !== collection)
      }
      setNftMarketActivityFilters({ ...nftMarketActivityFilters })
    },
    [setNftMarketActivityFilters, nftMarketActivityFilters],
  )

  const removeAllActivityFilters = useCallback(
    (collectionAddress: string) => {
      nftMarketActivityFilters[collectionAddress] = { ...initialNftActivityFilterState }
      setNftMarketActivityFilters({ ...nftMarketActivityFilters })
    },
    [nftMarketActivityFilters, setNftMarketActivityFilters],
  )

  const removeAllActivityCollectionFilters = useCallback(() => {
    nftMarketActivityFilters[''].collectionFilters = []
    setNftMarketActivityFilters({ ...nftMarketActivityFilters })
  }, [nftMarketActivityFilters, setNftMarketActivityFilters])

  const setShowOnlyOnSale = useCallback(
    ({ collection, showOnlyOnSale }: { collection: string; showOnlyOnSale: boolean }) => {
      if (nftMarketFilters[collection]) {
        nftMarketFilters[collection].showOnlyOnSale = showOnlyOnSale
      } else {
        nftMarketFilters[collection] = {
          ...initialNftFilterState,
          showOnlyOnSale,
        }
      }
      setNftMarketFilters({ ...nftMarketFilters })
    },
    [setNftMarketFilters, nftMarketFilters],
  )

  const setOrdering = useCallback(
    ({ collection, field, direction }: { collection: string; field: string; direction: 'asc' | 'desc' }) => {
      if (nftMarketFilters[collection]) {
        nftMarketFilters[collection].ordering = {
          field,
          direction,
        }
      } else {
        nftMarketFilters[collection] = {
          ...initialNftFilterState,
          ordering: {
            field,
            direction,
          },
        }
      }
      setNftMarketFilters({ ...nftMarketFilters })
    },
    [setNftMarketFilters, nftMarketFilters],
  )

  const removeAllItemFilters = useCallback(
    (collectionAddress: string) => {
      nftMarketFilters[collectionAddress] = { ...initialNftActivityFilterState }
      setNftMarketFilters({ ...nftMarketFilters })
    },
    [nftMarketFilters, setNftMarketFilters],
  )

  const updateItemFilters = useCallback(
    ({ collectionAddress, nftFilters }: { collectionAddress: string; nftFilters: Record<string, NftAttribute> }) => {
      if (nftMarketFilters[collectionAddress]) {
        nftMarketFilters[collectionAddress] = {
          ...nftMarketFilters[collectionAddress],
          activeFilters: { ...nftFilters },
        }
      } else {
        nftMarketFilters[collectionAddress] = {
          ...initialNftFilterState,
          activeFilters: { ...nftFilters },
        }
      }
      setNftMarketFilters({ ...nftMarketFilters })
    },
    [nftMarketFilters, setNftMarketFilters],
  )

  return {
    nftMarketFilters,
    nftMarketActivityFilters,
    tryVideoNftMedia,
    addActivityTypeFilters,
    addActivityCollectionFilters,
    removeActivityTypeFilters,
    removeActivityCollectionFilters,
    removeAllActivityFilters,
    removeAllActivityCollectionFilters,
    setShowOnlyOnSale,
    setOrdering,
    setTryVideoNftMedia,
    removeAllItemFilters,
    updateItemFilters,
  }
}
