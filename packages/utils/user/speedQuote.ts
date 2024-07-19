import { useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

export const userSpeedQuoteAtom = atomWithStorage<boolean | undefined>(
  'pcs:routing:speed-quote',
  undefined,
  undefined,
  { unstable_getOnInit: true },
)

export function useSpeedQuote() {
  return useAtom(userSpeedQuoteAtom)
}
