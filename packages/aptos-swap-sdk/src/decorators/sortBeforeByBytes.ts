import { Token } from '@pancakeswap/swap-sdk-core'
import { BCS } from 'aptos'
import compareByte, { ByteComparison } from 'src/compareByte'

export default function sortBeforeByBytes(current: Token, other: Token) {
  const otherBytes = BCS.bcsSerializeStr(other.address)
  const currentBytes = BCS.bcsSerializeStr(current.address)

  return compareByte(currentBytes, otherBytes) === ByteComparison.SMALLER
}
