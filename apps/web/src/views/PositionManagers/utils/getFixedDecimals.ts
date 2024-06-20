// Position manager ROR's values can be up to very smal precision
// this function is used to calculate nessecary decimals to show exact precision
// for vaults with small ROR that would otherwise get rounded
export const getFixedDecimals = (value?: number): number | undefined => {
  if (value === undefined) return undefined

  let decimalPlaces: number
  const absoluteValue = Math.abs(value)

  if (absoluteValue < 0.0000000001) {
    decimalPlaces = 12
  } else if (absoluteValue < 0.000000001) {
    decimalPlaces = 11
  } else if (absoluteValue < 0.00000001) {
    decimalPlaces = 10
  } else if (absoluteValue < 0.0000001) {
    decimalPlaces = 9
  } else if (absoluteValue < 0.000001) {
    decimalPlaces = 8
  } else if (absoluteValue < 0.00001) {
    decimalPlaces = 7
  } else if (absoluteValue < 0.0001) {
    decimalPlaces = 6
  } else if (absoluteValue < 0.001) {
    decimalPlaces = 5
  } else if (absoluteValue < 0.01) {
    decimalPlaces = 4
  } else {
    decimalPlaces = 2
  }

  return Number(value.toFixed(decimalPlaces))
}
