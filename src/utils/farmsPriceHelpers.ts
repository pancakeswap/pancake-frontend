import { Farm } from 'state/types'

export const filterFarmsByQuoteToken = (farms: Farm[], preferredQuoteTokens: string[] = ['BUSD', 'wBNB']): Farm => {
  const preferredFarm = farms.find((farm) => {
    return preferredQuoteTokens.some((quoteToken) => {
      return farm.quoteToken.symbol === quoteToken
    })
  })
  return preferredFarm || farms[0]
}

export default filterFarmsByQuoteToken
