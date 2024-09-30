import { getVersionUpgrade, VersionUpgrade } from '@pancakeswap/token-lists'
import { acceptListUpdate, updateListVersion, useFetchListCallback } from '@pancakeswap/token-lists/react'
import { useQuery } from '@tanstack/react-query'
import { EXCHANGE_PAGE_PATHS, UNIVERSAL_PAGE_PATHS } from 'config/constants/exchange'
import { UNSUPPORTED_LIST_URLS } from 'config/constants/lists'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useRouter } from 'next/router'
import { useEffect, useMemo } from 'react'
import { useActiveListUrlsByChainId, useAllListsByChainId } from 'state/lists/hooks'
import { usePublicClient } from 'wagmi'
import { initialState, useListState, useListStateReady } from './lists'

export default function Updater(): null {
  const { chainId } = useActiveChainId()
  return UpdaterByChainId({ chainId })
}

export function UpdaterByChainId({ chainId }: { chainId: number }): null {
  const provider = usePublicClient({ chainId })

  const [listState, dispatch] = useListState()
  const router = useRouter()
  const includeListUpdater = useMemo(() => {
    return [...EXCHANGE_PAGE_PATHS, ...UNIVERSAL_PAGE_PATHS].some((item) => {
      return router.pathname.startsWith(item)
    })
  }, [router.pathname])

  const isReady = useListStateReady()

  // get all loaded lists, and the active urls
  const lists = useAllListsByChainId(chainId)
  const activeListUrls = useActiveListUrlsByChainId(chainId)

  useEffect(() => {
    if (isReady) {
      dispatch(updateListVersion())
    }
  }, [dispatch, isReady])

  const fetchList = useFetchListCallback(dispatch)

  // whenever a list is not loaded and not loading, try again to load it
  useQuery({
    queryKey: ['first-fetch-token-list', lists],

    queryFn: () => {
      Object.keys(lists).forEach((listUrl) => {
        const list = lists[listUrl]
        if (!list.current && !list.loadingRequestId && !list.error) {
          fetchList(listUrl).catch((error) => console.debug('list added fetching error', error))
        }
      })
      return null
    },

    enabled: Boolean(isReady),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  })

  useQuery({
    queryKey: ['token-list', chainId],

    queryFn: async () => {
      return Promise.all(
        Object.keys(lists).map((url) =>
          fetchList(url).catch((error) => console.debug('interval list fetching error', error)),
        ),
      )
    },

    enabled: Boolean(includeListUpdater && isReady && listState !== initialState),
    refetchInterval: 1000 * 60 * 10,
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  })

  // if any lists from unsupported lists are loaded, check them too (in case new updates since last visit)
  useEffect(() => {
    if (isReady) {
      Object.keys(UNSUPPORTED_LIST_URLS).forEach((listUrl) => {
        const list = lists[listUrl]
        if (!list || (!list.current && !list.loadingRequestId && !list.error)) {
          fetchList(listUrl).catch((error) => console.debug('list added fetching error', error))
        }
      })
    }
  }, [fetchList, provider, lists, isReady])

  // automatically update lists if versions are minor/patch
  useEffect(() => {
    if (!isReady) return
    Object.keys(lists).forEach((listUrl) => {
      const list = lists[listUrl]
      if (list.current && list.pendingUpdate) {
        const bump = getVersionUpgrade(list.current.version, list.pendingUpdate.version)
        // eslint-disable-next-line default-case
        switch (bump) {
          case VersionUpgrade.NONE:
            throw new Error('unexpected no version bump')
          // update any active or inactive lists
          case VersionUpgrade.PATCH:
          case VersionUpgrade.MINOR:
          case VersionUpgrade.MAJOR:
            dispatch(acceptListUpdate(listUrl))
        }
      }
    })
  }, [dispatch, lists, activeListUrls, isReady])

  return null
}
