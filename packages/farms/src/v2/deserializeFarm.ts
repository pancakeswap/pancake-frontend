import { deserializeToken } from '@pancakeswap/token-lists'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import isUndefinedOrNull from '@pancakeswap/utils/isUndefinedOrNull'
import BigNumber from 'bignumber.js'
import dayjs from 'dayjs'
import { FARM_AUCTION_HOSTING_IN_SECONDS } from '../const'
import { DeserializedFarm, SerializedFarm } from '../types'
import {
  deserializeFarmBCakePublicData,
  deserializeFarmBCakeUserData,
  deserializeFarmUserData,
} from './deserializeFarmUserData'

export const deserializeFarm = (
  farm: SerializedFarm,
  auctionHostingInSeconds: number = FARM_AUCTION_HOSTING_IN_SECONDS,
): DeserializedFarm => {
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

  const auctionHostingStartDate = !isUndefinedOrNull(auctionHostingStartSeconds)
    ? new Date((auctionHostingStartSeconds as number) * 1000)
    : null
  const auctionHostingEndDate = auctionHostingStartDate
    ? dayjs(auctionHostingStartDate).add(auctionHostingInSeconds, 'seconds').toDate()
    : null
  const now = Date.now()
  const isFarmCommunity =
    isCommunity ||
    !!(
      auctionHostingStartDate &&
      auctionHostingEndDate &&
      auctionHostingStartDate.getTime() < now &&
      auctionHostingEndDate.getTime() > now
    )

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
    isCommunity: isFarmCommunity,
    auctionHostingEndDate: auctionHostingEndDate?.toJSON(),
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
