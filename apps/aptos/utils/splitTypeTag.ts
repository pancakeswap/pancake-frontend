// @ts-nocheck
import { Pair } from '@pancakeswap/aptos-swap-sdk'
import { parseTypeTag } from '@aptos-labs/ts-sdk'
import { HexString } from '@pancakeswap/awgmi'
import _get from 'lodash/get'

export default function splitTypeTag(resourceType) {
  if (!resourceType) return []

  try {
    const parsedTypeTag = parseTypeTag(resourceType)

    // If there is 2 args, assume it will be a pair
    if (_get(parsedTypeTag, 'value.typeArgs.length', 0) === 2) {
      return Pair.parseType(resourceType)
    }

    const [typeArg0, typeArg1, typeArg3] = _get(parsedTypeTag, 'value.typeArgs', [])

    return [
      `${HexString.fromUint8Array(typeArg0.value.address.data).toShortString()}::${
        typeArg0.value.moduleName.identifier
      }::${typeArg0.value.name.identifier}`,
      `${HexString.fromUint8Array(typeArg1.value.address.data).toShortString()}::${
        typeArg1.value.moduleName.identifier
      }::${typeArg1.value.name.identifier}`,
      `${HexString.fromUint8Array(typeArg3.value.address.data).toShortString()}::${
        typeArg3.value.moduleName.identifier
      }::${typeArg3.value.name.identifier}`,
    ]
  } catch (error) {
    return []
  }
}
