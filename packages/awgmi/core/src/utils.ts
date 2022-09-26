import { TxnBuilderTypes } from 'aptos'
import { APTOS_COIN } from './constants'
import { Address } from './types'

export const isAddress = (addr: string): addr is Address => {
  if (addr === APTOS_COIN) return true
  try {
    return Boolean(
      addr.startsWith('0x') && TxnBuilderTypes.AccountAddress.fromHex(addr) ? (addr as Address) : undefined,
    )
  } catch (error) {
    return false
  }
}

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
