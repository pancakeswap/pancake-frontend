import { updateQuery } from '@pancakeswap/utils/clientRouter'
import { useRouter } from 'next/router'
import { useCallback, useMemo } from 'react'

function filterHookFactory(filterName: string) {
  return function useFilter(): [string | undefined, (filter: string | undefined) => void] {
    const router = useRouter()
    const filter = useMemo(() => {
      const value = router.query[filterName]
      if (value) {
        if (Array.isArray(value)) {
          return decodeURIComponent(value[0])
        }
        return decodeURIComponent(value)
      }
      return undefined
    }, [router.query])

    const setFilter = useCallback(
      (value?: string) => {
        router.push(
          updateQuery(
            router.asPath,
            value
              ? {
                  [filterName]: encodeURIComponent(value.trim()),
                }
              : {},
          ),
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
export const usePreview = filterHookFactory('preview')
