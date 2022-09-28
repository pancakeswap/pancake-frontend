import { TxnBuilderTypes } from 'aptos'
import { Address } from './types'

export const isAccountAddress = (addr: string): addr is Address => {
  try {
    return Boolean(
      addr.startsWith('0x') && TxnBuilderTypes.AccountAddress.fromHex(addr) ? (addr as Address) : undefined,
    )
  } catch (error) {
    return false
  }
}

export const unwrapTypeFromString = (type: string) => {
  const bracketsRegexp = /(?<=<)[^\][\r\n]*(?=>)/g
  const match = bracketsRegexp.exec(type)
  if (match) {
    return match[0]
  }
  return undefined
}

export const unwrapTypeArgFromString = (type: string) => {
  const bracketsRegexp = /(?<=<)([^<>]+)(?=>)/g
  const match = bracketsRegexp.exec(type)
  if (match) {
    return match[0]
  }
  return undefined
}
