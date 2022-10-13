import { Token } from '@pancakeswap/swap-sdk-core'
import { BCS, TxnBuilderTypes } from 'aptos'
import compareByte, { ByteComparison } from 'src/compareByte'

function concatUnint8Arrays(...arrays: Uint8Array[]): Uint8Array {
  const sumLength = arrays.reduce((sum, arr) => sum + arr.length, 0)

  const newUint8Array = new Uint8Array(sumLength)

  arrays.forEach((arr, index) => {
    if (index === 0) {
      newUint8Array.set(arr)
    } else {
      newUint8Array.set(arr, arrays[index].length)
    }
  })

  return newUint8Array
}

/**
 * NOTE:
 * Why using slice(1) in module_name and name?
 *
 * bcsToBytes add a length byte at the first element but on SC, it compares only bytes of the string
 * For example:
 *  module_name = 'pancake'
 *  bcsToBytes(module_name) => [9, 48, 120, 112, 97, 110, 99, 97, 107, 101]
 *  bytes(module_name) => [48, 120, 112, 97, 110, 99, 97, 107, 101]
 *
 * For module_name and name, they use bytes for comparison, meanwhilte, address is used bcsToBytes
 *
 * Reference:
 * https://github.com/pancakeswap/aptos-contracts/blob/master/pancake-swap/sources/swap/swap_utils.move#L57-L73
 */
export default function sortBeforeByBytes(current: Token, other: Token) {
  const currentStructTag = TxnBuilderTypes.StructTag.fromString(current.address)
  const otherStructTag = TxnBuilderTypes.StructTag.fromString(other.address)

  const currentAddressBytes = BCS.bcsToBytes(currentStructTag.address)
  const otherAddressBytes = BCS.bcsToBytes(otherStructTag.address)

  const currentModuleNameBytes = BCS.bcsToBytes(currentStructTag.module_name).slice(1)
  const otherModuleNameBytes = BCS.bcsToBytes(otherStructTag.module_name).slice(1)

  const currentNameBytes = BCS.bcsToBytes(currentStructTag.name).slice(1)
  const otherNameBytes = BCS.bcsToBytes(otherStructTag.name).slice(1)

  const currentBytes = concatUnint8Arrays(currentAddressBytes, currentModuleNameBytes, currentNameBytes)
  const otherBytes = concatUnint8Arrays(otherAddressBytes, otherModuleNameBytes, otherNameBytes)

  return compareByte(currentBytes, otherBytes) === ByteComparison.SMALLER
}
