import BigNumber from 'bignumber.js'
import { BIG_ZERO } from 'utils/bigNumber'
import { filterFarmsByQuoteToken } from 'utils/farmsPriceHelpers'
import { Farm } from 'state/types'

const getFarmFromTokenSymbol = (farms: Farm[], tokenSymbol: string, preferredQuoteTokens?: string[]): Farm => {
  const farmsWithTokenSymbol = farms.filter((farm) => farm.token.symbol === tokenSymbol)
  const filteredFarm = filterFarmsByQuoteToken(farmsWithTokenSymbol, preferredQuoteTokens)
  return filteredFarm
}

const getFarmBaseTokenPrice = (farm: Farm, quoteTokenFarm: Farm, bnbPriceBusd: BigNumber) => {
  if (farm.quoteToken.symbol === 'BUSD') {
    return new BigNumber(farm.tokenPriceVsQuote)
  }

  if (farm.quoteToken.symbol === 'wBNB') {
    return bnbPriceBusd.times(farm.tokenPriceVsQuote)
  }

  // We can only calculate profits without a quoteTokenFarm for BUSD/BNB farms
  if (!quoteTokenFarm) {
    return BIG_ZERO
  }

  // Possible alternative farm quoteTokens:
  // UST (i.e. MIR-UST), pBTC (i.e. PNT-pBTC), BTCB (i.e. bBADGER-BTCB), ETH (i.e. SUSHI-ETH)
  // If the farm's quote token isn't BUSD or wBNB, we then use the quote token, of the original farm's quote token
  // i.e. for farm PNT - pBTC we use the pBTC farm's quote token - BNB, (pBTC - BNB)
  // from the BNB - pBTC price, we can calculate the PNT - BUSD price
  if (quoteTokenFarm.quoteToken.symbol === 'wBNB') {
    const quoteTokenInBusd = bnbPriceBusd.times(quoteTokenFarm.tokenPriceVsQuote)
    return new BigNumber(farm.tokenPriceVsQuote).times(quoteTokenInBusd)
  }

  if (quoteTokenFarm.quoteToken.symbol === 'BUSD') {
    const quoteTokenInBusd = quoteTokenFarm.tokenPriceVsQuote
    return new BigNumber(farm.tokenPriceVsQuote).times(quoteTokenInBusd)
  }

  // Catch in case token does not have immediate or once-removed BUSD/wBNB quoteToken
  return BIG_ZERO
}

const getFarmQuoteTokenPrice = (farm: Farm, quoteTokenFarm: Farm, bnbPriceBusd: BigNumber) => {
  if (farm.quoteToken.symbol === 'BUSD') {
    return new BigNumber(1)
  }

  if (farm.quoteToken.symbol === 'wBNB') {
    return bnbPriceBusd
  }

  if (!quoteTokenFarm) {
    return BIG_ZERO
  }

  if (quoteTokenFarm.quoteToken.symbol === 'wBNB') {
    return bnbPriceBusd.times(quoteTokenFarm.tokenPriceVsQuote)
  }

  if (quoteTokenFarm.quoteToken.symbol === 'BUSD') {
    return new BigNumber(quoteTokenFarm.tokenPriceVsQuote)
  }

  return BIG_ZERO
}

const fetchFarmsPrices = async (farms) => {
  const bnbBusdFarm = farms.find((farm: Farm) => farm.pid === 252)
  const bnbPriceBusd = bnbBusdFarm.tokenPriceVsQuote ? new BigNumber(1).div(bnbBusdFarm.tokenPriceVsQuote) : BIG_ZERO

  const farmsWithPrices = farms.map((farm: Farm) => {
    const quoteTokenFarm = getFarmFromTokenSymbol(farms, farm.quoteToken.symbol)
    const baseTokenPrice = getFarmBaseTokenPrice(farm, quoteTokenFarm, bnbPriceBusd).toJSON()
    const quoteTokenPrice = getFarmQuoteTokenPrice(farm, quoteTokenFarm, bnbPriceBusd).toJSON()

    const token = { ...farm.token, price: baseTokenPrice }
    const quoteToken = { ...farm.quoteToken, price: quoteTokenPrice }
    return { ...farm, token, quoteToken }
  })
  return farmsWithPrices
}

export default fetchFarmsPrices
