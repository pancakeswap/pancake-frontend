import { atom, useAtom } from 'jotai'
import dayjs from 'dayjs'
import { atomWithStorage } from 'jotai/utils'

const phishingBannerAtom = atomWithStorage<number>('pcs:phishing-banner', 0)

const hidePhishingBannerAtom = atom(
  (get) => {
    const now = dayjs()
    const last = dayjs(get(phishingBannerAtom))
    const notPreview = process.env.NEXT_PUBLIC_VERCEL_ENV !== 'preview'
    return last ? now.diff(last, 'days', true) >= 1 && notPreview : notPreview
  },
  (_, set) => set(phishingBannerAtom, Date.now()),
)

export function usePhishingBanner() {
  return useAtom(hidePhishingBannerAtom)
}
