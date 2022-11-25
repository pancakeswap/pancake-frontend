import { Pair } from '@pancakeswap/aptos-swap-sdk'
import { HexString, TypeTagParser } from 'aptos'
import _get from 'lodash/get'

export default function splitTypeTag(resourceType) {
  if (!resourceType) return []

  try {
    const parsedTypeTag = new TypeTagParser(resourceType).parseTypeTag()

    // If there is 2 args, assume it will be a pair
    if (_get(parsedTypeTag, 'value.type_args.length', 0) === 2) {
      return Pair.parseType(resourceType)
    }

    const [typeArg0, typeArg1, typeArg3] = _get(parsedTypeTag, 'value.type_args', [])

    return [
      `${HexString.fromUint8Array(typeArg0.value.address.address).toShortString()}::${
        typeArg0.value.module_name.value
      }::${typeArg0.value.name.value}`,
      `${HexString.fromUint8Array(typeArg1.value.address.address).toShortString()}::${
        typeArg1.value.module_name.value
      }::${typeArg1.value.name.value}`,
      `${HexString.fromUint8Array(typeArg3.value.address.address).toShortString()}::${
        typeArg3.value.module_name.value
      }::${typeArg3.value.name.value}`,
    ]
  } catch (error) {
    return []
  }
}
