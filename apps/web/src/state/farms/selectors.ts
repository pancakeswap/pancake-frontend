import BigNumber from 'bignumber.js'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { getBalanceAmount } from '@pancakeswap/utils/formatBalance'
import { createSelector } from '@reduxjs/toolkit'
import { deserializeFarm, deserializeFarmUserData } from '@pancakeswap/farms'
import { State } from '../types'

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
