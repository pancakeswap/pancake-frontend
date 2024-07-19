/* eslint-disable react-hooks/rules-of-hooks */
import { useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

export enum IdType {
  IFO = 'ifo',
  PERPETUALS = 'perpetuals',
  AFFILIATE_PROGRAM = 'affiliate-program',
  OPTIONS = 'options',
}

const perpetuals = atomWithStorage('pcs:NotUsCitizenAcknowledgement-perpetuals', false, undefined, {
  unstable_getOnInit: true,
})
const ifo = atomWithStorage<boolean>('pcs:NotUsCitizenAcknowledgement-ifo', false, undefined, {
  unstable_getOnInit: true,
})
const affiliateProgram = atomWithStorage<boolean>(
  'pcs:NotUsCitizenAcknowledgement-affiliate-program',
  false,
  undefined,
  { unstable_getOnInit: true },
)
const options = atomWithStorage<boolean>('pcs:NotUsCitizenAcknowledgement-options', false, undefined, {
  unstable_getOnInit: true,
})

export function useUserNotUsCitizenAcknowledgement(id: IdType) {
  switch (id) {
    case IdType.IFO:
      return useAtom(ifo)
    case IdType.AFFILIATE_PROGRAM:
      return useAtom(affiliateProgram)
    case IdType.PERPETUALS:
      return useAtom(perpetuals)
    case IdType.OPTIONS:
      return useAtom(options)
    default:
      return useAtom(perpetuals)
  }
}
