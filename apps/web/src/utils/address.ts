export function ellipseAddress(address: string | null | undefined, width = 6): string {
  if (!address) {
    return ''
  }

  if (width === -1) {
    return address
  }

  return `${address.slice(0, width)}...${address.slice(-width)}`
}
