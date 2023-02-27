import memoize from 'lodash/memoize'
/**
 * Truncate a transaction or address hash
 */
const truncateHash = memoize(
  (address: string, startLength = 4, endLength = 4) => {
    if (!address) return ''

    return `${address.substring(0, startLength)}...${address.substring(address.length - endLength)}`
  },
  (address, startLength, endLength) => `${address}#${startLength}#${endLength}`,
)

export default truncateHash
