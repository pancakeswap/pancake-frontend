import { useAtom, useAtomValue } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

const userExpertModeAtom = atomWithStorage<boolean>('pcs:expert-mode', false, undefined, { unstable_getOnInit: true })
const userExpertModeAcknowledgementAtom = atomWithStorage<boolean>('pcs:expert-mode-acknowledgement', true, undefined, {
  unstable_getOnInit: true,
})

export function useExpertMode() {
  return useAtom(userExpertModeAtom)
}

export function useIsExpertMode() {
  return useAtomValue(userExpertModeAtom)
}

export function useUserExpertModeAcknowledgement() {
  return useAtom(userExpertModeAcknowledgementAtom)
}
