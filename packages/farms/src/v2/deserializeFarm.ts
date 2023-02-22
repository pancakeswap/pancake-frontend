import BigNumber from 'bignumber.js'
import addSeconds from 'date-fns/addSeconds'
import { deserializeToken } from '@pancakeswap/token-lists'
import isUndefinedOrNull from '@pancakeswap/utils/isUndefinedOrNull'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { SerializedFarm, DeserializedFarm } from '../types'
import { deserializeFarmUserData } from './deserializeFarmUserData'
import { FARM_AUCTION_HOSTING_IN_SECONDS } from '../const'

export const deserializeFarm = (
  farm: SerializedFarm,
  auctionHostingInSeconds: number = FARM_AUCTION_HOSTING_IN_SECONDS,
): DeserializedFarm => {
  const {
    lpAddress,
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
  } = farm

  const auctionHostingStartDate = !isUndefinedOrNull(auctionHostingStartSeconds)
    ? new Date((auctionHostingStartSeconds as number) * 1000)
    : null
  const auctionHostingEndDate = auctionHostingStartDate
    ? addSeconds(auctionHostingStartDate, auctionHostingInSeconds)
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

  return {
    lpAddress,
    lpSymbol,
    pid,
    vaultPid,
    dual,
    multiplier,
    isCommunity: isFarmCommunity,
    auctionHostingEndDate: auctionHostingEndDate?.toJSON(),
    quoteTokenPriceBusd,
    tokenPriceBusd,
    token: deserializeToken(farm.token),
    quoteToken: deserializeToken(farm.quoteToken),
    userData: deserializeFarmUserData(farm),
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
  }
}
