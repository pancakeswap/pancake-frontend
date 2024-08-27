import { useAtom } from 'jotai'
import { useCallback, useState } from 'react'
import { DEFAULT_QUERIES, extendPoolsAtom, ExtendPoolsQuery, extendPoolsQueryAtom } from './atom'
import { fetchExplorerPoolsList } from './fetcher'

const RESET_QUERY_KEYS = ['protocols', 'orderBy', 'chains', 'pools', 'tokens'] as Array<keyof ExtendPoolsQuery>

export const useExtendPools = () => {
  const [query, _setQuery] = useAtom(extendPoolsQueryAtom)
  const [extendPools, updateExtendPools] = useAtom(extendPoolsAtom)
  const [pageEnd, setPageEnd] = useState(false)
  const fetchPoolList = useCallback(
    async (newQuery: Partial<ExtendPoolsQuery>) => {
      const mergedQueries = {
        ...query,
        ...newQuery,
      } as Required<ExtendPoolsQuery>

      let shouldReset = false
      for (const key of RESET_QUERY_KEYS) {
        if (mergedQueries[key] !== query[key]) {
          shouldReset = true
          break
        }
      }

      if (pageEnd) {
        if (shouldReset) {
          setPageEnd(false)
          mergedQueries.after = ''
        } else {
          return false
        }
      }

      const { pools, endCursor, hasNextPage } = await fetchExplorerPoolsList(mergedQueries)

      setPageEnd(!hasNextPage)
      if (shouldReset) {
        updateExtendPools([])
      }
      updateExtendPools(pools)
      _setQuery({ ...mergedQueries, after: endCursor ?? '' })

      return hasNextPage
    },
    [_setQuery, pageEnd, query, updateExtendPools],
  )

  const resetExtendPools = useCallback(() => {
    updateExtendPools([])
    setPageEnd(false)
    _setQuery(DEFAULT_QUERIES)
  }, [_setQuery, setPageEnd, updateExtendPools])

  return {
    extendPools,
    fetchPoolList,
    resetExtendPools,
  }
}
