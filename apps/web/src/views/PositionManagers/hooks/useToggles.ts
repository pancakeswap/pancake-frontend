import { useRouter } from 'next/router'
import { useSearchParams } from 'next/navigation'
import { useCallback, useMemo } from 'react'
import { updateQuery } from '@pancakeswap/utils/clientRouter'

function toggleHookFactory(queryName: string) {
  return function useToggle(): [boolean, () => void] {
    const router = useRouter()
    const searchParams = useSearchParams()
    const on = useMemo(() => searchParams.get(queryName) === '1', [searchParams])
    const toggle = useCallback(() => {
      router.push(
        updateQuery(router.asPath, {
          [queryName]: !on ? '1' : undefined,
        }),
        '',
        { scroll: false },
      )
    }, [router, on])

    return [on, toggle]
  }
}

export const useStakeOnly = toggleHookFactory('stakeOnly')

export const useBooster = toggleHookFactory('booster')
