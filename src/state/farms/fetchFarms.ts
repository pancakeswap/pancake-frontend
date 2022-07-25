import { SerializedFarmConfig } from 'config/constants/types'
import BigNumber from 'bignumber.js'
import { getFullDecimalMultiplier } from 'utils/getFullDecimalMultiplier'
import { BIG_ZERO, BIG_TWO } from '../../utils/bigNumber'
import { fetchPublicFarmsData } from './fetchPublicFarmData'
import { fetchMasterChefData } from './fetchMasterChefData'
import { SerializedFarm } from '../types'

function getLpInfo({
  tokenBalanceLP,
  quoteTokenBalanceLP,
  lpTokenBalanceMC,
  lpTotalSupply,
  tokenDecimals,
  quoteTokenDecimals,
}) {
  // Ratio in % of LP tokens that are staked in the MC, vs the total number in circulation
  const lpTokenRatio = new BigNumber(lpTokenBalanceMC).div(new BigNumber(lpTotalSupply))

  // Raw amount of token in the LP, including those not staked
  const tokenAmountTotal = new BigNumber(tokenBalanceLP).div(getFullDecimalMultiplier(tokenDecimals))
  const quoteTokenAmountTotal = new BigNumber(quoteTokenBalanceLP).div(getFullDecimalMultiplier(quoteTokenDecimals))

  // Amount of quoteToken in the LP that are staked in the MC
  const quoteTokenAmountMc = quoteTokenAmountTotal.times(lpTokenRatio)

  // Total staked in LP, in quote token value
  const lpTotalInQuoteToken = quoteTokenAmountMc.times(BIG_TWO)

  return {
    tokenAmountTotal: tokenAmountTotal.toJSON(),
    quoteTokenAmountTotal: quoteTokenAmountTotal.toJSON(),
    lpTotalSupply: new BigNumber(lpTotalSupply).toJSON(),
    lpTotalInQuoteToken: lpTotalInQuoteToken.toJSON(),
    tokenPriceVsQuote: quoteTokenAmountTotal.div(tokenAmountTotal).toJSON(),
  }
}

function farmLpTransformer(farmResult, masterChefResult) {
  return (farm, index) => {
    const [
      tokenBalanceLP,
      quoteTokenBalanceLP,
      lpTokenBalanceMC,
      lpTotalSupply,
      [tokenDecimals],
      [quoteTokenDecimals],
      proxyTokenBalanceLP,
      proxyQuoteTokenBalanceLP,
      proxyLpTokenBalanceMC,
      proxyLpTotalSupply,
    ] = farmResult[index]

    const [info, totalRegularAllocPoint] = masterChefResult[index]

    const allocPoint = info ? new BigNumber(info.allocPoint?._hex) : BIG_ZERO
    const poolWeight = totalRegularAllocPoint ? allocPoint.div(new BigNumber(totalRegularAllocPoint)) : BIG_ZERO

    const lpInfo = getLpInfo({
      tokenBalanceLP,
      quoteTokenBalanceLP,
      lpTokenBalanceMC,
      lpTotalSupply,
      tokenDecimals,
      quoteTokenDecimals,
    })

    const proxyLpInfo = proxyTokenBalanceLP
      ? getLpInfo({
          tokenBalanceLP: proxyTokenBalanceLP,
          quoteTokenBalanceLP: proxyQuoteTokenBalanceLP,
          lpTokenBalanceMC: proxyLpTokenBalanceMC,
          lpTotalSupply: proxyLpTotalSupply,
          tokenDecimals,
          quoteTokenDecimals,
        })
      : {}

    return {
      ...farm,
      token: farm.token,
      quoteToken: farm.quoteToken,
      poolWeight: poolWeight.toJSON(),
      multiplier: `${allocPoint.div(100).toString()}X`,
      ...lpInfo,
      proxyLpInfo,
    }
  }
}

const fetchFarms = async (farmsToFetch: SerializedFarmConfig[]): Promise<SerializedFarm[]> => {
  const { normalFarms, farmsWithProxy } = farmsToFetch.reduce(
    (acc, f) => {
      if (f.proxyLpAddresses) {
        return {
          ...acc,
          farmsWithProxy: [...acc.farmsWithProxy, f],
        }
      }
      return {
        ...acc,
        normalFarms: [...acc.normalFarms, f],
      }
    },
    { normalFarms: [], farmsWithProxy: [] },
  )

  const [farmResult, masterChefResult, proxyFarmResult, proxyMasterChefResult] = await Promise.all([
    fetchPublicFarmsData(normalFarms),
    fetchMasterChefData(normalFarms),
    fetchPublicFarmsData(farmsWithProxy),
    fetchMasterChefData(farmsWithProxy),
  ])

  return [
    ...farmsWithProxy.map(farmLpTransformer(proxyFarmResult, proxyMasterChefResult)),
    ...normalFarms.map(farmLpTransformer(farmResult, masterChefResult)),
  ]
}

export default fetchFarms
