import { Price } from '@pancakeswap/sdk'
import { ethers } from 'ethers'

/**
 * Helper to convert a Price class (from SDK) to an ethers.BigNumber
 */
const getBnFromPrice = (price: Price, significantDigits = 18) => {
  return ethers.BigNumber.from(price.toSignificant(significantDigits))
}

export default getBnFromPrice
