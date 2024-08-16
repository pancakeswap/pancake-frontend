import { useAtom, useAtomValue } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { isClient } from './isClient'

const userExpertModeAtom = atomWithStorage<boolean>(
  'pcs:expert-mode',
  false,
  undefined,
  isClient ? { unstable_getOnInit: true } : undefined,
)
const userExpertModeAcknowledgementAtom = atomWithStorage<boolean>(
  'pcs:expert-mode-acknowledgement',
  true,
  undefined,
  isClient ? { unstable_getOnInit: true } : undefined,
)

export function useExpertMode() {
  return useAtom(userExpertModeAtom)
}

export function useIsExpertMode() {
  return useAtomValue(userExpertModeAtom)
}

export function useUserExpertModeAcknowledgement() {
  return useAtom(userExpertModeAcknowledgementAtom)
}
