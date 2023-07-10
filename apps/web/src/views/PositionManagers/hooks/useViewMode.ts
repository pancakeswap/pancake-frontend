import { ViewMode } from '@pancakeswap/uikit'
import { useRouter } from 'next/router'
import { useSearchParams } from 'next/navigation'
import { useCallback, useMemo } from 'react'
import { updateQuery } from '@pancakeswap/utils/clientRouter'

export function useViewMode() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const mode = useMemo(
    () => (searchParams.get('view') === String(ViewMode.CARD).toLocaleLowerCase() ? ViewMode.CARD : ViewMode.TABLE),
    [searchParams],
  )
  const setViewMode = useCallback(
    (viewMode: ViewMode) => {
      if (mode === viewMode) {
        return
      }
      router.push(
        updateQuery(router.asPath, {
          view: viewMode.toLocaleLowerCase(),
        }),
        '',
        { scroll: false },
      )
    },
    [router, mode],
  )

  return {
    mode,
    setViewMode,
  }
}
