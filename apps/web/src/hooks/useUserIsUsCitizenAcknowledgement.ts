import { useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

const userNotUsCitizenAcknowledgementAtom = atomWithStorage<boolean>('pcs:NotUsCitizenAcknowledgement', false)

export function useUserNotUsCitizenAcknowledgement() {
  return useAtom(userNotUsCitizenAcknowledgementAtom)
}
