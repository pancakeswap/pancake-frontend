import { Address, keccak256, stringToBytes } from 'viem'

export function checksumAddress(address_: Address): Address {
  const hexAddress = address_.substring(2).toLowerCase()
  const hash = keccak256(stringToBytes(hexAddress), 'bytes')

  const address = hexAddress.split('')
  for (let i = 0; i < 40; i += 2) {
    // eslint-disable-next-line no-bitwise
    if (hash[i >> 1] >> 4 >= 8 && address[i]) {
      address[i] = address[i].toUpperCase()
    }
    // eslint-disable-next-line no-bitwise
    if ((hash[i >> 1] & 0x0f) >= 8 && address[i + 1]) {
      address[i + 1] = address[i + 1].toUpperCase()
    }
  }

  const result = `0x${address.join('')}` as const
  return result
}
