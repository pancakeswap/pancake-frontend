import _get from 'lodash/get'
import _toString from 'lodash/toString'

import _toNumber from 'lodash/toNumber'

export default function convertFarmsWithPriceIntoUSD(farmsWithPrices) {
  /**
   *  {
   *    address: usdPrice
   *  }
   * */
  const addressesWithUSD = farmsWithPrices.reduce((result, farm) => {
    const tokenAddress = farm?.token?.address
    const quoteTokenAddress = farm?.quoteToken?.address

    const newResult = result

    if (!result[tokenAddress]) {
      newResult[tokenAddress] = _toNumber(farm?.tokenPriceBusd)
    }

    if (!result[quoteTokenAddress]) {
      newResult[quoteTokenAddress] = _toNumber(farm?.quoteTokenPriceBusd)
    }

    return newResult
  }, {})

  return addressesWithUSD
}
