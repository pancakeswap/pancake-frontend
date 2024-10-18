import { Address, InvalidAddressError, keccak256, stringToBytes } from 'viem'

const addressRegex = /^0x[a-fA-F0-9]{40}$/

export function checksumAddress(address_: Address): Address {
  if (!isAddress(address_)) throw new InvalidAddressError({ address: address_ })

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

function isAddress(address: string): address is Address {
  if (!addressRegex.test(address)) return false
  if (address.toLowerCase() === address) return true
  return true
}
