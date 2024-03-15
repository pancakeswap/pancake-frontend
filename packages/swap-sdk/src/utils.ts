import { invariant } from '@epic-web/invariant'
import warning from 'tiny-warning'
import { Address, getAddress } from 'viem'

// warns if addresses are not checksummed
// eslint-disable-next-line consistent-return
export function validateAndParseAddress(address: string): Address {
  try {
    const checksummedAddress = getAddress(address)
    warning(address === checksummedAddress, `${address} is not checksummed.`)
    return checksummedAddress
  } catch (error) {
    invariant(false, `${address} is not a valid address.`)
  }
}
