/**
 * Truncates a wallet's address
 */
const truncateWalletAddress = (address: string, startLength = 4, endLength = 4) => {
  return `${address.substring(0, startLength)}...${address.substring(address.length - endLength)}`
}

export default truncateWalletAddress
