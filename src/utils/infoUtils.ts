import { getAddress } from '@ethersproject/address'

// returns the checksummed address if the address is valid, otherwise returns false
export const isAddress = (value: any): string | false => {
  try {
    return getAddress(value)
  } catch {
    return false
  }
}

export const getBscscanLink = (data: string, type: 'transaction' | 'token' | 'address' | 'block'): string => {
  const bscscanUrl = `https://bscscan.com`

  switch (type) {
    case 'transaction': {
      return `${bscscanUrl}/tx/${data}`
    }
    case 'token': {
      return `${bscscanUrl}/token/${data}`
    }
    case 'block': {
      return `${bscscanUrl}/block/${data}`
    }
    case 'address':
    default: {
      return `${bscscanUrl}/address/${data}`
    }
  }
}

// shorten the checksummed version of the input address to have 0x + 4 characters at start and end
export const shortenAddress = (address: string, chars = 4): string => {
  const parsed = isAddress(address)
  if (!parsed) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }
  return `${parsed.substring(0, chars + 2)}...${parsed.substring(42 - chars)}`
}

export function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
  return value !== null && value !== undefined
}

export const currentTimestamp = () => new Date().getTime()
