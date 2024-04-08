/* eslint-disable react-hooks/rules-of-hooks */
import { useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

export enum IdType {
  IFO = 'ifo',
  PERPETUALS = 'perpetuals',
  AFFILIATE_PROGRAM = 'affiliate-program',
  OPTIONS = 'options',
}

const perpetuals = atomWithStorage('pcs:NotUsCitizenAcknowledgement-perpetuals', false)
const ifo = atomWithStorage<boolean>('pcs:NotUsCitizenAcknowledgement-ifo', false)
const affiliateProgram = atomWithStorage<boolean>('pcs:NotUsCitizenAcknowledgement-affiliate-program', false)
const options = atomWithStorage<boolean>('pcs:NotUsCitizenAcknowledgement-options', false)

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
