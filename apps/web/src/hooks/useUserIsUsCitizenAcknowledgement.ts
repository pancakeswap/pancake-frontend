/* eslint-disable react-hooks/rules-of-hooks */
import { useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

export enum IdType {
  IFO = 'ifo',
  PERPETUALS = 'perpetuals',
  AFFILIATE_PROGRAM = 'affiliate-program',
}

const perpetuals = atomWithStorage('pcs:NotUsCitizenAcknowledgement-perpetuals', false)
const ifo = atomWithStorage<boolean>('pcs:NotUsCitizenAcknowledgement-ifo', false)
const affiliateProgram = atomWithStorage<boolean>('pcs:NotUsCitizenAcknowledgement-affiliate-program', false)

export function useUserNotUsCitizenAcknowledgement(id: IdType) {
  switch (id) {
    case IdType.IFO:
      return useAtom(ifo)
    case IdType.AFFILIATE_PROGRAM:
      return useAtom(affiliateProgram)
    default:
      return useAtom(perpetuals)
  }
}
