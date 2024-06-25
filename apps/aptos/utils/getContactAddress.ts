import { parseTypeTag } from '@aptos-labs/ts-sdk'
import { HexString } from '@pancakeswap/awgmi'
import _get from 'lodash/get'

export default function getContactAddress(resourceType: any) {
  if (!resourceType) return null

  try {
    const parsedTypeTag = parseTypeTag(resourceType)
    const contractAddress = _get(parsedTypeTag, 'value.address', '')

    // @ts-ignore
    return HexString.fromUint8Array(contractAddress.address).toShortString()
  } catch (error) {
    return null
  }
}
