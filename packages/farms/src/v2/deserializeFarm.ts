import { deserializeToken } from '@pancakeswap/token-lists'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import BigNumber from 'bignumber.js'
import { DeserializedFarm, SerializedFarm } from '../types'
import {
  deserializeFarmBCakePublicData,
  deserializeFarmBCakeUserData,
  deserializeFarmUserData,
} from './deserializeFarmUserData'

export const deserializeFarm = (farm: SerializedFarm): DeserializedFarm => {
  const {
    lpAddress,
    lpRewardsApr,
    lpSymbol,
    pid,
    vaultPid,
    dual,
    multiplier,
    isCommunity,
    auctionHostingStartSeconds,
    quoteTokenPriceBusd,
    tokenPriceBusd,
    boosted,
    infoStableSwapAddress,
    stableSwapAddress,
    stableLpFee,
    stableLpFeeRateOfTotalFee,
    bCakeWrapperAddress,
  } = farm

  const bCakeUserData = deserializeFarmBCakeUserData(farm)
  const bCakePublicData = deserializeFarmBCakePublicData(farm)
  return {
    bCakeWrapperAddress,
    lpAddress,
    lpRewardsApr,
    lpSymbol,
    pid,
    vaultPid,
    ...(dual && {
      dual: {
        ...dual,
        token: deserializeToken(dual?.token),
      },
    }),
    multiplier,
    quoteTokenPriceBusd,
    tokenPriceBusd,
    token: deserializeToken(farm.token),
    quoteToken: deserializeToken(farm.quoteToken),
    userData: deserializeFarmUserData(farm),
    bCakeUserData,
    tokenAmountTotal: farm.tokenAmountTotal ? new BigNumber(farm.tokenAmountTotal) : BIG_ZERO,
    quoteTokenAmountTotal: farm.quoteTokenAmountTotal ? new BigNumber(farm.quoteTokenAmountTotal) : BIG_ZERO,
    lpTotalInQuoteToken: farm.lpTotalInQuoteToken ? new BigNumber(farm.lpTotalInQuoteToken) : BIG_ZERO,
    lpTotalSupply: farm.lpTotalSupply ? new BigNumber(farm.lpTotalSupply) : BIG_ZERO,
    lpTokenPrice: farm.lpTokenPrice ? new BigNumber(farm.lpTokenPrice) : BIG_ZERO,
    tokenPriceVsQuote: farm.tokenPriceVsQuote ? new BigNumber(farm.tokenPriceVsQuote) : BIG_ZERO,
    poolWeight: farm.poolWeight ? new BigNumber(farm.poolWeight) : BIG_ZERO,
    boosted,
    isStable: Boolean(infoStableSwapAddress),
    stableSwapAddress,
    stableLpFee,
    stableLpFeeRateOfTotalFee,
    lpTokenStakedAmount: farm.lpTokenStakedAmount ? new BigNumber(farm.lpTokenStakedAmount) : BIG_ZERO,
    bCakePublicData,
  }
}
