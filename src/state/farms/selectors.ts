import BigNumber from 'bignumber.js'
import addSeconds from 'date-fns/addSeconds'
import { BIG_ZERO } from 'utils/bigNumber'
import { getBalanceAmount } from 'utils/formatBalance'
import isUndefinedOrNull from '@pancakeswap/utils/isUndefinedOrNull'
import { deserializeToken } from '@pancakeswap/tokens'
import { createSelector } from '@reduxjs/toolkit'
import _isEmpty from 'lodash/isEmpty'
import { State, SerializedFarm, DeserializedFarm, DeserializedFarmUserData } from '../types'
import { FARM_AUCTION_HOSTING_IN_SECONDS } from '../../config/constants'

const deserializeFarmUserData = (farm: SerializedFarm): DeserializedFarmUserData => {
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

const deserializeFarm = (farm: SerializedFarm): DeserializedFarm => {
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
    ? new Date(auctionHostingStartSeconds * 1000)
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

const selectCakeFarm = (state: State) => state.farms.data.find((f) => f.pid === 2)
const selectFarmByKey = (key: string, value: string | number) => (state: State) =>
  state.farms.data.find((f) => f[key] === value)

export const makeFarmFromPidSelector = (pid: number) =>
  createSelector([selectFarmByKey('pid', pid)], (farm) => deserializeFarm(farm))

export const makeBusdPriceFromPidSelector = (pid: number) =>
  createSelector([selectFarmByKey('pid', pid)], (farm) => {
    return farm && new BigNumber(farm.tokenPriceBusd)
  })

export const makeUserFarmFromPidSelector = (pid: number) =>
  createSelector([selectFarmByKey('pid', pid)], (farm) => {
    const { allowance, tokenBalance, stakedBalance, earnings, proxy } = deserializeFarmUserData(farm)
    return {
      allowance,
      tokenBalance,
      stakedBalance,
      earnings,
      proxy,
    }
  })

export const priceCakeFromPidSelector = createSelector([selectCakeFarm], (cakeBnbFarm) => {
  const cakePriceBusdAsString = cakeBnbFarm?.tokenPriceBusd
  return new BigNumber(cakePriceBusdAsString)
})

export const farmFromLpSymbolSelector = (lpSymbol: string) =>
  createSelector([selectFarmByKey('lpSymbol', lpSymbol)], (farm) => deserializeFarm(farm))

export const makeLpTokenPriceFromLpSymbolSelector = (lpSymbol: string) =>
  createSelector([selectFarmByKey('lpSymbol', lpSymbol)], (farm) => {
    let lpTokenPrice = BIG_ZERO
    if (farm) {
      const lpTotalInQuoteToken = farm.lpTotalInQuoteToken ? new BigNumber(farm.lpTotalInQuoteToken) : BIG_ZERO
      const lpTotalSupply = farm.lpTotalSupply ? new BigNumber(farm.lpTotalSupply) : BIG_ZERO

      if (lpTotalSupply.gt(0) && lpTotalInQuoteToken.gt(0)) {
        const farmTokenPriceInUsd = new BigNumber(farm.tokenPriceBusd)
        const tokenAmountTotal = farm.tokenAmountTotal ? new BigNumber(farm.tokenAmountTotal) : BIG_ZERO
        // Total value of base token in LP
        const valueOfBaseTokenInFarm = farmTokenPriceInUsd.times(tokenAmountTotal)
        // Double it to get overall value in LP
        const overallValueOfAllTokensInFarm = valueOfBaseTokenInFarm.times(2)
        // Divide total value of all tokens, by the number of LP tokens
        const totalLpTokens = getBalanceAmount(lpTotalSupply)
        lpTokenPrice = overallValueOfAllTokensInFarm.div(totalLpTokens)
      }
    }

    return lpTokenPrice
  })

export const farmSelector = (chainId: number) =>
  createSelector(
    (state: State) => state.farms,
    (farms) => {
      const deserializedFarmsData = farms.data.map(deserializeFarm).filter((farm) => farm.token.chainId === chainId)
      const { loadArchivedFarmsData, userDataLoaded, poolLength, regularCakePerBlock } = farms

      return {
        loadArchivedFarmsData,
        userDataLoaded,
        data: deserializedFarmsData,
        poolLength,
        regularCakePerBlock,
      }
    },
  )
