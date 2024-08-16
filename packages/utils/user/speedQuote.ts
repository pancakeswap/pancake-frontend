import { useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { isClient } from './isClient'

export const userSpeedQuoteAtom = atomWithStorage<boolean | undefined>(
  'pcs:routing:speed-quote',
  undefined,
  undefined,
  isClient ? { unstable_getOnInit: true } : undefined,
)

export function useSpeedQuote() {
  return useAtom(userSpeedQuoteAtom)
}
