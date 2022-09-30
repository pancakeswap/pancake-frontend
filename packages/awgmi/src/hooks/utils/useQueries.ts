import { QueriesOptions, useQueries as useQueries_ } from '@tanstack/react-query'
import { queryClientContext as context } from '../../context'

export function useQueries<T extends any[]>({ queries }: { queries: readonly [...QueriesOptions<T>] }) {
  const results = useQueries_({
    context,
    queries,
  })

  return results
}
