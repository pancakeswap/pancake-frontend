import { QueriesOptions, useQueries as useQueries_ } from '@tanstack/react-query'
import { useMemo } from 'react'
import { queryClientContext as context } from '../../context'

export function useQueries<T extends any[]>({ queries }: { queries: readonly [...QueriesOptions<T>] }) {
  const results = useQueries_({
    context,
    queries,
  })

  // NOTE: use dataUpdatedAt because results from useQueires not memoized
  const updatedAts = results?.length ? results.map(({ dataUpdatedAt }) => dataUpdatedAt).join('-') : ''

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => results, [updatedAts])
}
