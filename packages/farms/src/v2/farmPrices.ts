import { BIG_ONE, BIG_TWO, BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import BN from 'bignumber.js'
import { equalsIgnoreCase } from '@pancakeswap/utils/equalsIgnoreCase'
import toNumber from 'lodash/toNumber'
import { SerializedFarmPublicData, FarmData, isStableFarm } from '../types'
import { getFullDecimalMultiplier } from './getFullDecimalMultiplier'

// Find BUSD price for token
// either via direct calculation if farm is X-BNB or X-BUSD
// or via quoteTokenFarm which is quoteToken-BNB or quoteToken-BUSD farm
export const getFarmBaseTokenPrice = (
  farm: SerializedFarmPublicData,
  quoteTokenFarm: SerializedFarmPublicData,
  nativePriceUSD: BN,
  wNative: string,
  stable: string,
  quoteTokenInBusd: any,
): BN => {
  const hasTokenPriceVsQuote = Boolean(farm.tokenPriceVsQuote)

  if (farm.quoteToken.symbol === stable) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return hasTokenPriceVsQuote ? new BN(farm.tokenPriceVsQuote!) : BIG_ONE
  }

  if (farm.quoteToken.symbol === wNative) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return hasTokenPriceVsQuote ? nativePriceUSD.times(new BN(farm.tokenPriceVsQuote!)) : BIG_ONE
  }

  // We can only calculate profits without a quoteTokenFarm for BUSD/BNB farms
  if (!quoteTokenFarm) {
    return BIG_ZERO
  }

  // Possible alternative farm quoteTokens:
  // UST (i.e. MIR-UST), pBTC (i.e. PNT-pBTC), BTCB (i.e. bBADGER-BTCB), ETH (i.e. SUSHI-ETH)
  // If the farm's quote token isn't BUSD or WBNB, we then use the quote token, of the original farm's quote token
  // i.e. for farm PNT - pBTC we use the pBTC farm's quote token - BNB, (pBTC - BNB)
  // from the BNB - pBTC price, we can calculate the PNT - BUSD price
  if (quoteTokenFarm.quoteToken.symbol === wNative || quoteTokenFarm.quoteToken.symbol === stable) {
    return hasTokenPriceVsQuote && quoteTokenInBusd
      ? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        new BN(farm.tokenPriceVsQuote!).times(quoteTokenInBusd)
      : BIG_ONE
  }

  // Catch in case token does not have immediate or once-removed BUSD/WBNB quoteToken
  return BIG_ZERO
}

export const getFarmQuoteTokenPrice = (
  farm: SerializedFarmPublicData,
  quoteTokenFarm: SerializedFarmPublicData,
  nativePriceUSD: BN,
  wNative: string,
  stable: string,
): BN => {
  if (farm.quoteToken.symbol === stable) {
    return BIG_ONE
  }

  if (farm.quoteToken.symbol === wNative) {
    return nativePriceUSD
  }

  if (!quoteTokenFarm) {
    return BIG_ZERO
  }

  if (quoteTokenFarm.quoteToken.symbol === wNative) {
    return quoteTokenFarm.tokenPriceVsQuote ? nativePriceUSD.times(new BN(quoteTokenFarm.tokenPriceVsQuote)) : BIG_ZERO
  }

  if (quoteTokenFarm.quoteToken.symbol === stable) {
    return quoteTokenFarm.tokenPriceVsQuote ? new BN(quoteTokenFarm.tokenPriceVsQuote) : BIG_ZERO
  }

  return BIG_ZERO
}

const getFarmFromTokenAddress = (
  farms: SerializedFarmPublicData[],
  tokenAddress: string,
  preferredQuoteTokens?: string[],
): SerializedFarmPublicData => {
  const farmsWithTokenSymbol = farms.filter((farm) => equalsIgnoreCase(farm.token.address, tokenAddress))
  const filteredFarm = filterFarmsByQuoteToken(farmsWithTokenSymbol, preferredQuoteTokens)
  return filteredFarm
}

const filterFarmsByQuoteToken = (
  farms: SerializedFarmPublicData[],
  preferredQuoteTokens: string[] = ['BUSD', 'WBNB'],
): SerializedFarmPublicData => {
  const preferredFarm = farms.find((farm) => {
    return preferredQuoteTokens.some((quoteToken) => {
      return farm.quoteToken.symbol === quoteToken
    })
  })
  return preferredFarm || farms[0]
}

export const getStableLpTokenPrice = (
  lpTotalSupply: BN,
  tokenAmountTotal: BN,
  tokenPriceBusd: BN,
  quoteTokenAmountTotal: BN,
  quoteTokenInBusd: BN,
  decimals: number,
) => {
  if (lpTotalSupply.isZero()) {
    return BIG_ZERO
  }
  const valueOfBaseTokenInFarm = tokenPriceBusd.times(tokenAmountTotal)
  const valueOfQuoteTokenInFarm = quoteTokenInBusd.times(quoteTokenAmountTotal)

  const liquidity = valueOfBaseTokenInFarm.plus(valueOfQuoteTokenInFarm)

  const totalLpTokens = lpTotalSupply.div(getFullDecimalMultiplier(decimals))

  return liquidity.div(totalLpTokens)
}

export const getLpTokenPrice = (
  lpTotalSupply: BN,
  lpTotalInQuoteToken: BN,
  tokenAmountTotal: BN,
  tokenPriceBusd: BN,
  decimals: number,
) => {
  // LP token price
  let lpTokenPrice = BIG_ZERO
  if (lpTotalSupply.gt(0) && lpTotalInQuoteToken.gt(0)) {
    // Total value of base token in LP
    const valueOfBaseTokenInFarm = tokenPriceBusd.times(tokenAmountTotal)
    // Double it to get overall value in LP
    const overallValueOfAllTokensInFarm = valueOfBaseTokenInFarm.times(BIG_TWO)
    // Divide total value of all tokens, by the number of LP tokens
    const totalLpTokens = lpTotalSupply.div(getFullDecimalMultiplier(decimals))
    lpTokenPrice = overallValueOfAllTokensInFarm.div(totalLpTokens)
  }

  return lpTokenPrice
}

export type FarmWithPrices = FarmData & {
  tokenPriceBusd: string
  quoteTokenPriceBusd: string
  lpTokenPrice: string
}

export const getFarmsPrices = (
  farms: FarmData[],
  nativeStableLp: {
    address: string
    wNative: string
    stable: string
  },
  decimals: number,
): FarmWithPrices[] => {
  const nativeStableFarm = farms.find((farm) => equalsIgnoreCase(farm.lpAddress, nativeStableLp.address))

  const isNativeFirst = nativeStableFarm?.token.symbol === nativeStableLp.wNative

  const nativePriceUSD =
    nativeStableFarm && toNumber(nativeStableFarm?.tokenPriceVsQuote) !== 0
      ? isNativeFirst
        ? new BN(nativeStableFarm.tokenPriceVsQuote)
        : BIG_ONE.div(new BN(nativeStableFarm.tokenPriceVsQuote))
      : BIG_ZERO

  const farmsWithPrices = farms.map((farm) => {
    const quoteTokenFarm = getFarmFromTokenAddress(farms, farm.quoteToken.address, [
      nativeStableLp.wNative,
      nativeStableLp.stable,
    ])

    const quoteTokenPriceBusd = getFarmQuoteTokenPrice(
      farm,
      quoteTokenFarm,
      nativePriceUSD,
      nativeStableLp.wNative,
      nativeStableLp.stable,
    )

    const tokenPriceBusd = getFarmBaseTokenPrice(
      farm,
      quoteTokenFarm,
      nativePriceUSD,
      nativeStableLp.wNative,
      nativeStableLp.stable,
      quoteTokenPriceBusd,
    )

    const lpTokenPrice = isStableFarm(farm)
      ? getStableLpTokenPrice(
          new BN(farm.lpTotalSupply),
          new BN(farm.tokenAmountTotal),
          tokenPriceBusd,
          new BN(farm.quoteTokenAmountTotal),
          quoteTokenPriceBusd,
          decimals,
        )
      : getLpTokenPrice(
          new BN(farm.lpTotalSupply),
          new BN(farm.lpTotalInQuoteToken),
          new BN(farm.tokenAmountTotal),
          tokenPriceBusd,
          decimals,
        )

    return {
      ...farm,
      tokenPriceBusd: tokenPriceBusd.toString(),
      quoteTokenPriceBusd: quoteTokenPriceBusd.toString(),
      lpTokenPrice: lpTokenPrice.toString(),
    }
  })

  return farmsWithPrices
}
