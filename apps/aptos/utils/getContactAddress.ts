import { HexString, TypeTagParser } from 'aptos'
import _get from 'lodash/get'

export default function getContactAddress(resourceType) {
  if (!resourceType) return null

  try {
    const parsedTypeTag = new TypeTagParser(resourceType).parseTypeTag()
    const contractAddress = _get(parsedTypeTag, 'value.address', '')

    return HexString.fromUint8Array(contractAddress.address).toShortString()
  } catch (error) {
    return null
  }
}
