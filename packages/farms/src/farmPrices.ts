import { BigNumber, FixedNumber } from '@ethersproject/bignumber'
import { ChainId } from '@pancakeswap/sdk'
import _toNumber from 'lodash/toNumber'
import { SerializedFarmPublicData, FarmData } from './types'
import { equalsIgnoreCase } from './equalsIgnoreCase'
import { FIXED_ONE, FIXED_TEN_IN_POWER_18, FIXED_TWO, FIXED_ZERO } from './const'

// Find BUSD price for token
// either via direct calculation if farm is X-BNB or X-BUSD
// or via quoteTokenFarm which is quoteToken-BNB or quoteToken-BUSD farm
export const getFarmBaseTokenPrice = (
  farm: SerializedFarmPublicData,
  quoteTokenFarm: SerializedFarmPublicData,
  nativePriceUSD: FixedNumber,
  wNative: string,
  stable: string,
  quoteTokenInBusd,
): FixedNumber => {
  const hasTokenPriceVsQuote = Boolean(farm.tokenPriceVsQuote)

  if (farm.quoteToken.symbol === stable) {
    return hasTokenPriceVsQuote ? FixedNumber.from(farm.tokenPriceVsQuote) : FIXED_ONE
  }

  if (farm.quoteToken.symbol === wNative) {
    return hasTokenPriceVsQuote ? nativePriceUSD.mulUnsafe(FixedNumber.from(farm.tokenPriceVsQuote)) : FIXED_ONE
  }

  // We can only calculate profits without a quoteTokenFarm for BUSD/BNB farms
  if (!quoteTokenFarm) {
    return FIXED_ZERO
  }

  // Possible alternative farm quoteTokens:
  // UST (i.e. MIR-UST), pBTC (i.e. PNT-pBTC), BTCB (i.e. bBADGER-BTCB), ETH (i.e. SUSHI-ETH)
  // If the farm's quote token isn't BUSD or WBNB, we then use the quote token, of the original farm's quote token
  // i.e. for farm PNT - pBTC we use the pBTC farm's quote token - BNB, (pBTC - BNB)
  // from the BNB - pBTC price, we can calculate the PNT - BUSD price
  if (quoteTokenFarm.quoteToken.symbol === wNative || quoteTokenFarm.quoteToken.symbol === stable) {
    return hasTokenPriceVsQuote && quoteTokenInBusd
      ? FixedNumber.from(farm.tokenPriceVsQuote).mulUnsafe(quoteTokenInBusd)
      : FIXED_ONE
  }

  // Catch in case token does not have immediate or once-removed BUSD/WBNB quoteToken
  return FIXED_ZERO
}

export const getFarmQuoteTokenPrice = (
  farm: SerializedFarmPublicData,
  quoteTokenFarm: SerializedFarmPublicData,
  nativePriceUSD: FixedNumber,
  wNative: string,
  stable: string,
): FixedNumber => {
  if (farm.quoteToken.symbol === stable) {
    return FIXED_ONE
  }

  if (farm.quoteToken.symbol === wNative) {
    return nativePriceUSD
  }

  if (!quoteTokenFarm) {
    return FIXED_ZERO
  }

  if (quoteTokenFarm.quoteToken.symbol === wNative) {
    return quoteTokenFarm.tokenPriceVsQuote
      ? nativePriceUSD.mulUnsafe(FixedNumber.from(quoteTokenFarm.tokenPriceVsQuote))
      : FIXED_ZERO
  }

  if (quoteTokenFarm.quoteToken.symbol === stable) {
    return quoteTokenFarm.tokenPriceVsQuote ? FixedNumber.from(quoteTokenFarm.tokenPriceVsQuote) : FIXED_ZERO
  }

  return FIXED_ZERO
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
  lpTotalSupply: FixedNumber,
  tokenAmountTotal: FixedNumber,
  tokenPriceBusd: FixedNumber,
  quoteTokenAmountTotal: FixedNumber,
  quoteTokenInBusd: FixedNumber,
) => {
  if (lpTotalSupply.isZero()) {
    return FIXED_ZERO
  }
  const valueOfBaseTokenInFarm = tokenPriceBusd.mulUnsafe(tokenAmountTotal)
  const valueOfQuoteTokenInFarm = quoteTokenInBusd.mulUnsafe(quoteTokenAmountTotal)

  const liquidity = valueOfBaseTokenInFarm.addUnsafe(valueOfQuoteTokenInFarm)

  const totalLpTokens = lpTotalSupply.divUnsafe(FIXED_TEN_IN_POWER_18)

  return liquidity.divUnsafe(totalLpTokens)
}

export const getLpTokenPrice = (
  lpTotalSupply: FixedNumber,
  lpTotalInQuoteToken: FixedNumber,
  tokenAmountTotal: FixedNumber,
  tokenPriceBusd: FixedNumber,
) => {
  // LP token price
  let lpTokenPrice = FIXED_ZERO
  const lpTotalSupplyAsBigNumber = BigNumber.from(lpTotalSupply)
  const lpTotalInQuoteTokenBigNumber = BigNumber.from(lpTotalInQuoteToken)
  if (lpTotalSupplyAsBigNumber.gt(0) && lpTotalInQuoteTokenBigNumber.gt(0)) {
    // Total value of base token in LP
    const valueOfBaseTokenInFarm = tokenPriceBusd.mulUnsafe(tokenAmountTotal)
    // Double it to get overall value in LP
    const overallValueOfAllTokensInFarm = valueOfBaseTokenInFarm.mulUnsafe(FIXED_TWO)
    // Divide total value of all tokens, by the number of LP tokens
    const totalLpTokens = lpTotalSupply.divUnsafe(FIXED_TEN_IN_POWER_18)
    lpTokenPrice = overallValueOfAllTokensInFarm.divUnsafe(totalLpTokens)
  }

  return lpTokenPrice
}

export type FarmWithPrices = FarmData & {
  tokenPriceBusd: string
  quoteTokenPriceBusd: string
  lpTokenPrice: string
}

export const getFarmsPrices = (farms: FarmData[], chainId: number): FarmWithPrices[] => {
  if (!nativeStableLpMap[chainId]) {
    throw new Error(`chainId ${chainId} not supported`)
  }

  const nativeStableFarm = farms.find((farm) => equalsIgnoreCase(farm.lpAddress, nativeStableLpMap[chainId].address))

  const nativePriceUSD =
    _toNumber(nativeStableFarm?.tokenPriceVsQuote) !== 0
      ? FIXED_ONE.divUnsafe(FixedNumber.from(nativeStableFarm.tokenPriceVsQuote))
      : FIXED_ZERO

  const farmsWithPrices = farms.map((farm) => {
    const quoteTokenFarm = getFarmFromTokenAddress(farms, farm.quoteToken.address, [
      nativeStableLpMap[chainId].wNative,
      nativeStableLpMap[chainId].stable,
    ])

    const quoteTokenPriceBusd = getFarmQuoteTokenPrice(
      farm,
      quoteTokenFarm,
      nativePriceUSD,
      nativeStableLpMap[chainId].wNative,
      nativeStableLpMap[chainId].stable,
    )

    const tokenPriceBusd = getFarmBaseTokenPrice(
      farm,
      quoteTokenFarm,
      nativePriceUSD,
      nativeStableLpMap[chainId].wNative,
      nativeStableLpMap[chainId].stable,
      quoteTokenPriceBusd,
    )
    const lpTokenPrice = farm?.stableSwapAddress
      ? getStableLpTokenPrice(
          FixedNumber.from(farm.lpTotalSupply),
          FixedNumber.from(farm.tokenAmountTotal),
          tokenPriceBusd,
          FixedNumber.from(farm.quoteTokenAmountTotal),
          // Assume token is busd, tokenPriceBusd is tokenPriceVsQuote
          FixedNumber.from(farm.tokenPriceVsQuote),
        )
      : getLpTokenPrice(
          FixedNumber.from(farm.lpTotalSupply),
          FixedNumber.from(farm.lpTotalInQuoteToken),
          FixedNumber.from(farm.tokenAmountTotal),
          tokenPriceBusd,
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

const nativeStableLpMap = {
  [ChainId.GOERLI]: {
    address: '0xf5bf0C34d3c428A74Ceb98d27d38d0036C587200',
    wNative: 'WETH',
    stable: 'tUSDC',
  },
  [ChainId.BSC]: {
    address: '0x58F876857a02D6762E0101bb5C46A8c1ED44Dc16',
    wNative: 'WBNB',
    stable: 'BUSD',
  },
  [ChainId.BSC_TESTNET]: {
    address: '0x4E96D2e92680Ca65D58A0e2eB5bd1c0f44cAB897',
    wNative: 'WBNB',
    stable: 'BUSD',
  },
}
