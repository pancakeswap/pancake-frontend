import { QueriesOptions, useQueries as useQueries_ } from '@tanstack/react-query'
import { queryClientContext as context } from '../../context'

export function useQueries({ queries }: { queries: readonly [...QueriesOptions<any>] }) {
  const results = useQueries_({
    context,
    queries,
  })

  return results
}
