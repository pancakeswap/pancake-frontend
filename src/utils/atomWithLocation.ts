import { atom } from 'jotai'
import type { PrimitiveAtom, SetStateAction } from 'jotai'

type Location = {
  pathname?: string
  searchParams?: URLSearchParams
}

const getLocation = (): Location =>
  typeof window !== 'undefined' && {
    pathname: window.location.pathname,
    searchParams: new URLSearchParams(window.location.search),
  }

const applyLocation = (location: Location, options?: { replace?: boolean }): void => {
  const url = new URL(window.location.href)
  if (location.pathname) {
    url.pathname = location.pathname
  }
  if (location.searchParams) {
    url.search = location.searchParams.toString()
  }
  if (options?.replace) {
    window.history.replaceState(null, '', url)
  } else {
    window.history.pushState(null, '', url)
  }
}

const subscribe = (callback: () => void) => {
  window.addEventListener('popstate', callback)
  return () => window.removeEventListener('popstate', callback)
}

type Options<T> = {
  preloaded?: T
  replace?: boolean
  getLocation?: () => T
  applyLocation?: (location: T, options?: { replace?: boolean }) => void
  subscribe?: (callback: () => void) => () => void
}

type RequiredOptions<T> = Omit<Options<T>, 'getLocation' | 'applyLocation'> &
  Required<Pick<Options<T>, 'getLocation' | 'applyLocation'>>

export function atomWithLocation(options?: Options<Location>): PrimitiveAtom<Location>

export function atomWithLocation<T>(options: RequiredOptions<T>): PrimitiveAtom<T>

export function atomWithLocation<T>(options?: Options<T>) {
  const getL = options?.getLocation || (getLocation as unknown as NonNullable<Options<T>['getLocation']>)
  const appL = options?.applyLocation || (applyLocation as unknown as NonNullable<Options<T>['applyLocation']>)
  const sub = options?.subscribe || subscribe
  const baseAtom = atom(options?.preloaded ?? getL())
  baseAtom.onMount = (set) => {
    const callback = () => set(getL())
    const unsub = sub(callback)
    callback()
    return unsub
  }
  const derivedAtom = atom(
    (get) => get(baseAtom),
    (get, set, arg: SetStateAction<T>) => {
      set(baseAtom, arg)
      appL(get(baseAtom), options)
    },
  )
  return derivedAtom
}
