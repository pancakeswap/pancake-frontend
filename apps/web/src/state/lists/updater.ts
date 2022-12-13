import { getVersionUpgrade, VersionUpgrade } from '@pancakeswap/token-lists'
import { acceptListUpdate, updateListVersion, useFetchListCallback } from '@pancakeswap/token-lists/react'
import { EXCHANGE_PAGE_PATHS } from 'config/constants/exchange'
import { UNSUPPORTED_LIST_URLS } from 'config/constants/lists'
import useWeb3Provider from 'hooks/useActiveWeb3React'
import { useRouter } from 'next/router'
import { useEffect, useMemo } from 'react'
import { useAllLists } from 'state/lists/hooks'
import useSWRImuutable from 'swr/immutable'
import { useActiveListUrls } from './hooks'
import { useListState, useListStateReady, initialState } from './lists'

export default function Updater(): null {
  const { provider } = useWeb3Provider()
  const [listState, dispatch] = useListState()
  const router = useRouter()
  const includeListUpdater = useMemo(() => {
    return EXCHANGE_PAGE_PATHS.some((item) => {
      return router.pathname.startsWith(item)
    })
  }, [router.pathname])

  const isReady = useListStateReady()

  // get all loaded lists, and the active urls
  const lists = useAllLists()
  const activeListUrls = useActiveListUrls()

  useEffect(() => {
    if (isReady) {
      dispatch(updateListVersion())
    }
  }, [dispatch, isReady])

  const fetchList = useFetchListCallback(dispatch)

  // whenever a list is not loaded and not loading, try again to load it
  useSWRImuutable(isReady && ['first-fetch-token-list', lists], () => {
    Object.keys(lists).forEach((listUrl) => {
      const list = lists[listUrl]
      if (!list.current && !list.loadingRequestId && !list.error) {
        fetchList(listUrl).catch((error) => console.debug('list added fetching error', error))
      }
    })
  })

  useSWRImuutable(
    includeListUpdater && isReady && listState !== initialState ? ['token-list'] : null,
    () => {
      Object.keys(lists).forEach((url) =>
        fetchList(url).catch((error) => console.debug('interval list fetching error', error)),
      )
    },
    {
      dedupingInterval: 1000 * 60 * 10,
      refreshInterval: 1000 * 60 * 10,
    },
  )

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
