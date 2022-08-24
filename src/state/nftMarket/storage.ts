import { useLastUpdated } from '@pancakeswap/hooks'
import { useEffect } from 'react'
import { MarketEvent, NftActivityFilter, NftFilter, NftAttribute } from './types'

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

export const addActivityTypeFilters = ({ collection, field }: { collection: string; field: MarketEvent }) => {
  const nftMarketActivityFilters = JSON.parse(sessionStorage?.getItem('nftMarketActivityFilters') ?? '{}')
  if (nftMarketActivityFilters[collection]) {
    nftMarketActivityFilters[collection].typeFilters.push(field)
  } else {
    nftMarketActivityFilters[collection] = {
      ...initialNftActivityFilterState,
      typeFilters: [field],
    }
  }
  sessionStorage?.setItem('nftMarketActivityFilters', JSON.stringify(nftMarketActivityFilters))
  const event = new Event('itemUpdated')

  // @ts-ignore
  event.key = 'nftMarketActivityFilters'
  document.dispatchEvent(event)
}

export const addActivityCollectionFilters = ({ collection }: { collection: string }) => {
  const nftMarketActivityFilters = JSON.parse(sessionStorage?.getItem('nftMarketActivityFilters') ?? '{}')
  if (nftMarketActivityFilters['']) {
    nftMarketActivityFilters[''].collectionFilters.push(collection)
  } else {
    nftMarketActivityFilters[''] = {
      ...initialNftActivityFilterState,
      collectionFilters: [collection],
    }
  }
  sessionStorage?.setItem('nftMarketActivityFilters', JSON.stringify(nftMarketActivityFilters))
  const event = new Event('itemUpdated')

  // @ts-ignore
  event.key = 'nftMarketActivityFilters'
  document.dispatchEvent(event)
}

export const removeActivityTypeFilters = ({ collection, field }: { collection: string; field: MarketEvent }) => {
  const nftMarketActivityFilters = JSON.parse(sessionStorage?.getItem('nftMarketActivityFilters') ?? '{}')
  if (nftMarketActivityFilters[collection]) {
    nftMarketActivityFilters[collection].typeFilters = nftMarketActivityFilters[collection].typeFilters.filter(
      (activeFilter) => activeFilter !== field,
    )
  }
  sessionStorage?.setItem('nftMarketActivityFilters', JSON.stringify(nftMarketActivityFilters))
  const event = new Event('itemUpdated')

  // @ts-ignore
  event.key = 'nftMarketActivityFilters'
  document.dispatchEvent(event)
}

export const removeActivityCollectionFilters = ({ collection }: { collection: string }) => {
  const nftMarketActivityFilters = JSON.parse(sessionStorage?.getItem('nftMarketActivityFilters') ?? '{}')
  if (nftMarketActivityFilters['']) {
    nftMarketActivityFilters[collection].collectionFilters = nftMarketActivityFilters[
      collection
    ].collectionFilters.filter((activeFilter) => activeFilter !== collection)
  }
  sessionStorage?.setItem('nftMarketActivityFilters', JSON.stringify(nftMarketActivityFilters))
  const event = new Event('itemUpdated')

  // @ts-ignore
  event.key = 'nftMarketActivityFilters'
  document.dispatchEvent(event)
}

export const removeAllActivityFilters = (collectionAddress: string) => {
  const nftMarketActivityFilters = JSON.parse(sessionStorage?.getItem('nftMarketActivityFilters') ?? '{}')
  nftMarketActivityFilters[collectionAddress] = { ...initialNftActivityFilterState }
  sessionStorage?.setItem('nftMarketActivityFilters', JSON.stringify(nftMarketActivityFilters))
  const event = new Event('itemUpdated')

  // @ts-ignore
  event.key = 'nftMarketActivityFilters'
  document.dispatchEvent(event)
}

export const removeAllActivityCollectionFilters = () => {
  const nftMarketActivityFilters = JSON.parse(sessionStorage?.getItem('nftMarketActivityFilters') ?? '{}')
  nftMarketActivityFilters[''].collectionFilters = []
  sessionStorage?.setItem('nftMarketActivityFilters', JSON.stringify(nftMarketActivityFilters))
  const event = new Event('itemUpdated')

  // @ts-ignore
  event.key = 'nftMarketActivityFilters'
  document.dispatchEvent(event)
}

export const setShowOnlyOnSale = ({ collection, showOnlyOnSale }: { collection: string; showOnlyOnSale: boolean }) => {
  const nftMarketFilters = JSON.parse(sessionStorage?.getItem('nftMarketFilters') ?? '{}')
  if (nftMarketFilters[collection]) {
    nftMarketFilters[collection].showOnlyOnSale = showOnlyOnSale
  } else {
    nftMarketFilters[collection] = {
      ...initialNftFilterState,
      showOnlyOnSale,
    }
  }
  sessionStorage?.setItem('nftMarketFilters', JSON.stringify(nftMarketFilters))
  const event = new Event('itemUpdated')

  // @ts-ignore
  event.key = 'nftMarketFilters'
  document.dispatchEvent(event)
}

export const setOrdering = ({
  collection,
  field,
  direction,
}: {
  collection: string
  field: string
  direction: 'asc' | 'desc'
}) => {
  const nftMarketFilters = JSON.parse(sessionStorage?.getItem('nftMarketFilters') ?? '{}')
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
  sessionStorage?.setItem('nftMarketFilters', JSON.stringify(nftMarketFilters))
  const event = new Event('itemUpdated')

  // @ts-ignore
  event.key = 'nftMarketFilters'
  document.dispatchEvent(event)
}

export const removeAllItemFilters = (collectionAddress: string) => {
  const nftMarketFilters = JSON.parse(sessionStorage?.getItem('nftMarketFilters') ?? '{}')
  nftMarketFilters[collectionAddress] = { ...initialNftActivityFilterState }
  sessionStorage?.setItem('nftMarketFilters', JSON.stringify(nftMarketFilters))
  const event = new Event('itemUpdated')

  // @ts-ignore
  event.key = 'nftMarketFilters'
  document.dispatchEvent(event)
}

export const setTryVideoNftMedia = (tryVideoNftMedia: boolean) => {
  sessionStorage?.setItem('nftMarketTryVideoNftMedia', JSON.stringify(tryVideoNftMedia))
  const event = new Event('itemUpdated')

  // @ts-ignore
  event.key = 'nftMarketTryVideoNftMedia'
  document.dispatchEvent(event)
}

export const updateItemFilters = ({
  collectionAddress,
  nftFilters,
}: {
  collectionAddress: string
  nftFilters: Record<string, NftAttribute>
}) => {
  const nftMarketFilters = JSON.parse(sessionStorage?.getItem('nftMarketFilters') ?? '{}')
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
  sessionStorage?.setItem('nftMarketFilters', JSON.stringify(nftMarketFilters))
  const event = new Event('itemUpdated')

  // @ts-ignore
  event.key = 'nftMarketFilters'
  document.dispatchEvent(event)
}

export const useSessionStorageListener = (key: string) => {
  const { setLastUpdated: refresh } = useLastUpdated()
  useEffect(() => {
    const handleStorage = (event) => {
      if (event.key === key) {
        refresh()
      }
    }
    document.addEventListener('itemUpdated', handleStorage)
    return () => {
      document.removeEventListener('itemUpdated', handleStorage)
    }
  }, [refresh, key])
}
