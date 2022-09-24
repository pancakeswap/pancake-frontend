import { TxnBuilderTypes } from 'aptos'
import { Address } from './types'

export const isAddress = (addr: string) =>
  addr.startsWith('0x') && TxnBuilderTypes.AccountAddress.fromHex(addr) ? (addr as Address) : undefined

export const unwrapStrutTagTypeFromString = (type: string) => {
  const bracketsRegexp = /(?<=<).+?(>)/g
  const match = bracketsRegexp.exec(type)
  if (match) {
    return match[0]
  }
  return undefined
}

export const unwrapStrutTagTypeArgFromString = (type: string) => {
  const bracketsRegexp = /(?<=<)([^<>]+)(?=>)/g
  const match = bracketsRegexp.exec(type)
  if (match) {
    return match[0]
  }
  return undefined
}
