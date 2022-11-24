import BigNumber from 'bignumber.js'
import addSeconds from 'date-fns/addSeconds'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import isUndefinedOrNull from '@pancakeswap/utils/isUndefinedOrNull'
import { deserializeToken } from '@pancakeswap/token-lists'
import _isEmpty from 'lodash/isEmpty'
import type { SerializedFarm, DeserializedFarm, DeserializedFarmUserData } from '@pancakeswap/farms'

export const FARM_AUCTION_HOSTING_IN_SECONDS = 691200

export const deserializeFarmUserData = (farm: SerializedFarm): DeserializedFarmUserData => {
  return {
    allowance: farm.userData ? new BigNumber(farm.userData.allowance) : BIG_ZERO,
    tokenBalance: farm.userData ? new BigNumber(farm.userData.tokenBalance) : BIG_ZERO,
    stakedBalance: farm.userData ? new BigNumber(farm.userData.stakedBalance) : BIG_ZERO,
    earnings: farm.userData ? new BigNumber(farm.userData.earnings) : BIG_ZERO,
    proxy: {
      allowance: farm?.userData?.proxy ? new BigNumber(farm?.userData?.proxy.allowance) : BIG_ZERO,
      tokenBalance: farm?.userData?.proxy ? new BigNumber(farm?.userData?.proxy.tokenBalance) : BIG_ZERO,
      stakedBalance: farm?.userData?.proxy ? new BigNumber(farm?.userData?.proxy.stakedBalance) : BIG_ZERO,
      earnings: farm?.userData?.proxy ? new BigNumber(farm?.userData?.proxy.earnings) : BIG_ZERO,
    },
  }
}

export const deserializeFarm = (farm: SerializedFarm): DeserializedFarm => {
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
  } = farm

  const auctionHostingStartDate = !isUndefinedOrNull(auctionHostingStartSeconds)
    ? new Date((auctionHostingStartSeconds as number) * 1000)
    : null
  const auctionHostingEndDate = auctionHostingStartDate
    ? addSeconds(auctionHostingStartDate, FARM_AUCTION_HOSTING_IN_SECONDS)
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
  }
}
