// import { BigNumber, FixedNumber } from '@ethersproject/bignumber'
import { equalsIgnoreCase } from '@pancakeswap/utils/equalsIgnoreCase'
import { getFullDecimalMultiplier } from '@pancakeswap/utils/getFullDecimalMultiplier'
import _toNumber from 'lodash/toNumber'
import BigNumber from 'bignumber.js'
import { BIG_ZERO, BIG_ONE, BIG_TWO } from '@pancakeswap/utils/bigNumber'
import { SerializedFarmPublicData, FarmData, isStableFarm } from '@pancakeswap/farms/src/types'

// Find BUSD price for token
// either via direct calculation if farm is X-BNB or X-BUSD
// or via quoteTokenFarm which is quoteToken-BNB or quoteToken-BUSD farm
export const getFarmBaseTokenPrice = (
  farm: SerializedFarmPublicData,
  quoteTokenFarm: SerializedFarmPublicData,
  nativePriceUSD: BigNumber,
  wNative: string,
  stable: string,
  quoteTokenInBusd,
): BigNumber => {
  const hasTokenPriceVsQuote = Boolean(farm.tokenPriceVsQuote)

  if (farm.quoteToken.symbol === stable) {
    return hasTokenPriceVsQuote ? new BigNumber(farm.tokenPriceVsQuote ?? BIG_ZERO) : BIG_ONE
  }

  if (farm.quoteToken.symbol === wNative) {
    return hasTokenPriceVsQuote
      ? nativePriceUSD.multipliedBy(new BigNumber(farm.tokenPriceVsQuote ?? BIG_ZERO))
      : BIG_ONE
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
      ? new BigNumber(farm.tokenPriceVsQuote ?? BIG_ZERO).multipliedBy(quoteTokenInBusd)
      : BIG_ONE
  }

  // Catch in case token does not have immediate or once-removed BUSD/WBNB quoteToken
  return BIG_ZERO
}

export const getFarmQuoteTokenPrice = (
  farm: SerializedFarmPublicData,
  quoteTokenFarm: SerializedFarmPublicData,
  nativePriceUSD: BigNumber,
  wNative: string,
  stable: string,
  isNativeFirst: boolean,
): BigNumber => {
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
    return quoteTokenFarm.tokenPriceVsQuote && quoteTokenFarm.tokenPriceVsQuote !== '0'
      ? isNativeFirst
        ? nativePriceUSD.multipliedBy(quoteTokenFarm.tokenPriceVsQuote)
        : nativePriceUSD.multipliedBy(BIG_ONE.div(quoteTokenFarm.tokenPriceVsQuote))
      : BIG_ZERO
  }

  if (quoteTokenFarm.quoteToken.symbol === stable) {
    return quoteTokenFarm.tokenPriceVsQuote && quoteTokenFarm.tokenPriceVsQuote !== '0'
      ? new BigNumber(quoteTokenFarm.tokenPriceVsQuote)
      : BIG_ZERO
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
  preferredQuoteTokens: string[] = ['USDC', 'APT'],
): SerializedFarmPublicData => {
  const preferredFarm = farms.find((farm) => {
    return preferredQuoteTokens.some((quoteToken) => {
      return farm.quoteToken.symbol === quoteToken
    })
  })
  return preferredFarm || farms[0]
}

export const getStableLpTokenPrice = (
  lpTotalSupply: BigNumber,
  tokenAmountTotal: BigNumber,
  tokenPriceBusd: BigNumber,
  quoteTokenAmountTotal: BigNumber,
  quoteTokenInBusd: BigNumber,
  decimals: number,
) => {
  if (lpTotalSupply.isZero()) {
    return BIG_ZERO
  }
  const valueOfBaseTokenInFarm = tokenPriceBusd.multipliedBy(tokenAmountTotal)
  const valueOfQuoteTokenInFarm = quoteTokenInBusd.multipliedBy(quoteTokenAmountTotal)

  const liquidity = valueOfBaseTokenInFarm.plus(valueOfQuoteTokenInFarm)

  const totalLpTokens = lpTotalSupply.div(getFullDecimalMultiplier(decimals))

  return liquidity.div(totalLpTokens)
}

export const getLpTokenPrice = (
  lpTotalSupply: BigNumber,
  lpTotalInQuoteToken: BigNumber,
  tokenAmountTotal: BigNumber,
  tokenPriceBusd: BigNumber,
  decimals: number,
) => {
  // LP token price
  let lpTokenPrice = BIG_ZERO
  const lpTotalSupplyAsBigNumber = lpTotalSupply
  const lpTotalInQuoteTokenBigNumber = lpTotalInQuoteToken
  if (lpTotalSupplyAsBigNumber.gt(0) && lpTotalInQuoteTokenBigNumber.gt(0)) {
    // Total value of base token in LP
    const valueOfBaseTokenInFarm = tokenPriceBusd.multipliedBy(tokenAmountTotal)
    // Double it to get overall value in LP
    const overallValueOfAllTokensInFarm = valueOfBaseTokenInFarm.multipliedBy(BIG_TWO)
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
    nativeStableFarm && _toNumber(nativeStableFarm?.tokenPriceVsQuote) !== 0
      ? isNativeFirst
        ? new BigNumber(nativeStableFarm.tokenPriceVsQuote)
        : BIG_ONE.div(nativeStableFarm.tokenPriceVsQuote)
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
      isNativeFirst,
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
          new BigNumber(farm.lpTotalSupply),
          new BigNumber(farm.tokenAmountTotal),
          tokenPriceBusd,
          new BigNumber(farm.quoteTokenAmountTotal),
          // Assume token is busd, tokenPriceBusd is tokenPriceVsQuote
          new BigNumber(farm.tokenPriceVsQuote),
          decimals,
        )
      : getLpTokenPrice(
          new BigNumber(farm.lpTotalSupply),
          new BigNumber(farm.lpTotalInQuoteToken),
          new BigNumber(farm.tokenAmountTotal),
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
