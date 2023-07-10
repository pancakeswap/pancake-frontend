import { useRouter } from 'next/router'
import { useSearchParams } from 'next/navigation'
import { useCallback, useMemo } from 'react'
import { updateQuery } from '@pancakeswap/utils/clientRouter'

function filterHookFactory(filterName: string) {
  return function useFilter(): [string | undefined, (filter: string | undefined) => void] {
    const router = useRouter()
    const searchParams = useSearchParams()
    const filter = useMemo(() => searchParams.get(filterName), [searchParams])

    const setFilter = useCallback(
      (value?: string) => {
        router.push(
          updateQuery(router.asPath, {
            [filterName]: value,
          }),
          '',
          { scroll: false },
        )
      },
      [router],
    )

    return [filter, setFilter]
  }
}

export const useSortBy = filterHookFactory('sortBy')

export const useSearch = filterHookFactory('search')
