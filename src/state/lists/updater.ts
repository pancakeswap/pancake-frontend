import { useInterval, useIsWindowVisible } from '@pancakeswap/hooks'
import { useFetchListCallback } from '@pancakeswap/token-lists'
import { acceptListUpdate, updateListVersion } from '@pancakeswap/token-lists/src/actions'
import { getVersionUpgrade, VersionUpgrade } from '@uniswap/token-lists'
import { UNSUPPORTED_LIST_URLS } from 'config/constants/lists'
import useWeb3Provider from 'hooks/useActiveWeb3React'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useMemo } from 'react'
import { useAllLists } from 'state/lists/hooks'
import { useActiveListUrls } from './hooks'
import { useListState } from './lists'

export default function Updater(): null {
  const { provider } = useWeb3Provider()
  const [, dispatch] = useListState()
  const isWindowVisible = useIsWindowVisible()
  const router = useRouter()
  const includeListUpdater = useMemo(() => {
    return ['/swap', '/limit-orders', 'liquidity', '/add', '/find', '/remove'].some((item) => {
      return router.pathname.startsWith(item)
    })
  }, [router.pathname])

  // get all loaded lists, and the active urls
  const lists = useAllLists()
  const activeListUrls = useActiveListUrls()

  useEffect(() => {
    dispatch(updateListVersion())
  }, [dispatch])

  const fetchList = useFetchListCallback(dispatch)
  const fetchAllListsCallback = useCallback(() => {
    if (!isWindowVisible) return
    Object.keys(lists).forEach((url) =>
      fetchList(url).catch((error) => console.debug('interval list fetching error', error)),
    )
  }, [fetchList, isWindowVisible, lists])

  // fetch all lists every 10 minutes, but only after we initialize library and page has currency input
  useInterval(fetchAllListsCallback, provider ? 1000 * 60 * 10 : null, true, includeListUpdater)

  // whenever a list is not loaded and not loading, try again to load it
  useEffect(() => {
    Object.keys(lists).forEach((listUrl) => {
      const list = lists[listUrl]
      if (!list.current && !list.loadingRequestId && !list.error) {
        fetchList(listUrl).catch((error) => console.debug('list added fetching error', error))
      }
    })
  }, [fetchList, provider, lists])

  // if any lists from unsupported lists are loaded, check them too (in case new updates since last visit)
  useEffect(() => {
    Object.keys(UNSUPPORTED_LIST_URLS).forEach((listUrl) => {
      const list = lists[listUrl]
      if (!list || (!list.current && !list.loadingRequestId && !list.error)) {
        fetchList(listUrl).catch((error) => console.debug('list added fetching error', error))
      }
    })
  }, [fetchList, provider, lists])

  // automatically update lists if versions are minor/patch
  useEffect(() => {
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
  }, [dispatch, lists, activeListUrls])

  return null
}
