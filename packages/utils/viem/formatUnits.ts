// Copy from viem package to avoid unnecessary dependency
export function formatUnits(value: bigint, decimals: number) {
  let display = value.toString()

  const negative = display.startsWith('-')
  if (negative) display = display.slice(1)

  display = display.padStart(decimals, '0')

  let [integer, fraction] = [display.slice(0, display.length - decimals), display.slice(display.length - decimals)]
  fraction = fraction.replace(/(0+)$/, '')
  integer = integer || '0'

  return `${negative ? '-' : ''}${integer}${fraction ? `.${fraction}` : ''}`
}
