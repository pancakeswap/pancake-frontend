import { safeGetAddress } from 'utils'

export function shortenAddress(address: string, chars = 4): string {
  const parsed = safeGetAddress(address)
  if (!parsed) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }
  return `${parsed.substring(0, chars + 2)}...${parsed.substring(42 - chars)}`
}
export function feeTierPercent(fee: number): string {
  return `${fee / 10_000}%`
}

export const currentTimestamp = () => new Date().getTime()
