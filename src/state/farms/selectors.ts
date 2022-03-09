import BigNumber from 'bignumber.js'
import { BIG_ZERO } from 'utils/bigNumber'
import { getBalanceAmount } from 'utils/formatBalance'
import { createSelector } from '@reduxjs/toolkit'
import { State, SerializedFarm, DeserializedFarm, DeserializedFarmUserData } from '../types'
import { deserializeToken } from '../user/hooks/helpers'

const deserializeFarmUserData = (farm: SerializedFarm): DeserializedFarmUserData => {
  return {
    allowance: farm.userData ? new BigNumber(farm.userData.allowance) : BIG_ZERO,
    tokenBalance: farm.userData ? new BigNumber(farm.userData.tokenBalance) : BIG_ZERO,
    stakedBalance: farm.userData ? new BigNumber(farm.userData.stakedBalance) : BIG_ZERO,
    earnings: farm.userData ? new BigNumber(farm.userData.earnings) : BIG_ZERO,
  }
}

const deserializeFarm = (farm: SerializedFarm): DeserializedFarm => {
  const { lpAddresses, lpSymbol, pid, dual, multiplier, isCommunity, quoteTokenPriceBusd, tokenPriceBusd } = farm

  return {
    lpAddresses,
    lpSymbol,
    pid,
    dual,
    multiplier,
    isCommunity,
    quoteTokenPriceBusd,
    tokenPriceBusd,
    token: deserializeToken(farm.token),
    quoteToken: deserializeToken(farm.quoteToken),
    userData: deserializeFarmUserData(farm),
    tokenAmountTotal: farm.tokenAmountTotal ? new BigNumber(farm.tokenAmountTotal) : BIG_ZERO,
    lpTotalInQuoteToken: farm.lpTotalInQuoteToken ? new BigNumber(farm.lpTotalInQuoteToken) : BIG_ZERO,
    lpTotalSupply: farm.lpTotalSupply ? new BigNumber(farm.lpTotalSupply) : BIG_ZERO,
    tokenPriceVsQuote: farm.tokenPriceVsQuote ? new BigNumber(farm.tokenPriceVsQuote) : BIG_ZERO,
    poolWeight: farm.poolWeight ? new BigNumber(farm.poolWeight) : BIG_ZERO,
  }
}

const selectCakeFarm = (state: State) => state.farms.data.find((f) => f.pid === 251)
const selectFarmByKey = (key: string, value: string | number) => (state: State) =>
  state.farms.data.find((f) => f[key] === value)

export const makeFarmFromPidSelector = (pid: number) =>
  createSelector([selectFarmByKey('pid', pid)], (farm) => deserializeFarm(farm))

export const makeBusdPriceFromPidSelector = (pid: number) =>
  createSelector([selectFarmByKey('pid', pid)], (farm) => {
    const deserializedFarm = deserializeFarm(farm)
    return deserializedFarm && new BigNumber(deserializedFarm.tokenPriceBusd)
  })

export const makeUserFarmFromPidSelector = (pid: number) =>
  createSelector([selectFarmByKey('pid', pid)], (farm) => {
    const { userData } = deserializeFarm(farm)
    const { allowance, tokenBalance, stakedBalance, earnings } = userData
    return {
      allowance,
      tokenBalance,
      stakedBalance,
      earnings,
    }
  })

export const priceCakeFromPidSelector = createSelector([selectCakeFarm], (cakeBnbFarm) => {
  const deserializedCakeBnbFarm = deserializeFarm(cakeBnbFarm)
  const cakePriceBusdAsString = deserializedCakeBnbFarm.tokenPriceBusd
  return new BigNumber(cakePriceBusdAsString)
})

export const farmFromLpSymbolSelector = (lpSymbol: string) =>
  createSelector([selectFarmByKey('lpSymbol', lpSymbol)], (farm) => deserializeFarm(farm))

export const makeLpTokenPriceFromLpSymbolSelector = (lpSymbol: string) =>
  createSelector([selectFarmByKey('lpSymbol', lpSymbol)], (farm) => {
    const deserializedFarm = deserializeFarm(farm)
    const farmTokenPriceInUsd = deserializedFarm && new BigNumber(deserializedFarm.tokenPriceBusd)
    let lpTokenPrice = BIG_ZERO

    if (deserializedFarm.lpTotalSupply.gt(0) && deserializedFarm.lpTotalInQuoteToken.gt(0)) {
      // Total value of base token in LP
      const valueOfBaseTokenInFarm = farmTokenPriceInUsd.times(deserializedFarm.tokenAmountTotal)
      // Double it to get overall value in LP
      const overallValueOfAllTokensInFarm = valueOfBaseTokenInFarm.times(2)
      // Divide total value of all tokens, by the number of LP tokens
      const totalLpTokens = getBalanceAmount(deserializedFarm.lpTotalSupply)
      lpTokenPrice = overallValueOfAllTokensInFarm.div(totalLpTokens)
    }

    return lpTokenPrice
  })

export const farmSelector = createSelector(
  (state: State) => state.farms,
  (farms) => {
    const deserializedFarmsData = farms.data.map(deserializeFarm)
    const { loadArchivedFarmsData, userDataLoaded, poolLength } = farms
    return {
      loadArchivedFarmsData,
      userDataLoaded,
      data: deserializedFarmsData,
      poolLength,
    }
  },
)
