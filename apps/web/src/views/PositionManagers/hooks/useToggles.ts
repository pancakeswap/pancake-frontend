import { useRouter } from 'next/router'
import { useCallback, useMemo } from 'react'
import { updateQuery } from '@pancakeswap/utils/clientRouter'

function toggleHookFactory(queryName: string) {
  return function useToggle(): [boolean, () => void] {
    const router = useRouter()
    const on = useMemo(() => router.query[queryName] === '1', [router.query])
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
