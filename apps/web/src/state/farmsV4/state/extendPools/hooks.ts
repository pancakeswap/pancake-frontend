import { useAtom } from 'jotai'
import { useCallback, useEffect, useState } from 'react'
import { extendPoolsAtom, ExtendPoolsQuery, extendPoolsQueryAtom } from './atom'
import { fetchExplorerPoolsList } from './fetcher'

const RESET_QUERY_KEYS = ['protocols', 'orderBy', 'chains', 'pools', 'tokens'] as Array<keyof ExtendPoolsQuery>

export const useExtendPools = () => {
  const [query, _setQuery] = useAtom(extendPoolsQueryAtom)
  const [extendPools, updateExtendPools] = useAtom(extendPoolsAtom)
  const [pageEnd, setPageEnd] = useState(false)
  const [nextCursor, setNextCursor] = useState('')
  const setQuery = useCallback(
    async (newQuery: Partial<ExtendPoolsQuery>) => {
      const shouldReset = Object.keys(newQuery).some((k) => RESET_QUERY_KEYS.includes(k as keyof ExtendPoolsQuery))
      if (pageEnd) {
        if (shouldReset) {
          setPageEnd(false)
        } else {
          return false
        }
      }

      const q = { ...query, ...newQuery } as Required<ExtendPoolsQuery>
      const { pools, endCursor, hasNextPage } = await fetchExplorerPoolsList(q)

      setPageEnd(!hasNextPage)
      if (shouldReset) {
        updateExtendPools([])
      }
      updateExtendPools(pools)
      _setQuery(q)
      setNextCursor(endCursor ?? '')

      return hasNextPage
    },
    [_setQuery, pageEnd, query, updateExtendPools],
  )
  const getNextPage = useCallback(() => {
    if (pageEnd) return

    setQuery({ after: nextCursor })
  }, [nextCursor, pageEnd, setQuery])

  useEffect(() => {
    setQuery({ after: '' })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    extendPools,
    query,
    setQuery,
    getNextPage,
  }
}
