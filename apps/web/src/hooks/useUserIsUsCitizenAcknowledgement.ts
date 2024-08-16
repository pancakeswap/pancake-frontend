/* eslint-disable react-hooks/rules-of-hooks */
import { useAtom } from 'jotai'
import atomWithStorageWithErrorCatch from 'utils/atomWithStorageWithErrorCatch'

export enum IdType {
  IFO = 'ifo',
  PERPETUALS = 'perpetuals',
  AFFILIATE_PROGRAM = 'affiliate-program',
  OPTIONS = 'options',
}

const perpetuals = atomWithStorageWithErrorCatch('pcs:NotUsCitizenAcknowledgement-perpetuals', false)
const ifo = atomWithStorageWithErrorCatch('pcs:NotUsCitizenAcknowledgement-ifo', false)
const affiliateProgram = atomWithStorageWithErrorCatch('pcs:NotUsCitizenAcknowledgement-affiliate-program', false)
const options = atomWithStorageWithErrorCatch('pcs:NotUsCitizenAcknowledgement-options', false)

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
