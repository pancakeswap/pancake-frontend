const removeTrailingZerosRegex = new RegExp(/(\.\d*?[1-9])0+$/, 'g')

const removeTrailingZeros = (amount: string): string => {
  return amount.replace(removeTrailingZerosRegex, '$1')
}

export default removeTrailingZeros
