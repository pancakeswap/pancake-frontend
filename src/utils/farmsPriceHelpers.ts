import { Farm } from 'state/types'

/**
 * Returns the first farm with a quote token that matches from an array of preferred quote tokens
 * @param farms Array of farms
 * @param preferredQuoteTokens Array of preferred quote tokens
 * @returns A preferred farm, if found - or the first element of the farms array
 */
export const filterFarmsByQuoteToken = (farms: Farm[], preferredQuoteTokens: string[] = ['BUSD', 'wBNB']): Farm => {
  const preferredFarm = farms.find((farm) => {
    return preferredQuoteTokens.some((quoteToken) => {
      return farm.quoteToken.symbol === quoteToken
    })
  })
  return preferredFarm || farms[0]
}

export default filterFarmsByQuoteToken
