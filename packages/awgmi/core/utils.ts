import { TxnBuilderTypes } from 'aptos'
import { Address } from './types'

export const isAddress = (addr: string) =>
  addr.startsWith('0x') && TxnBuilderTypes.AccountAddress.fromHex(addr) ? (addr as Address) : undefined
