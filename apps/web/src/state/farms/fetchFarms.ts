import BigNumber from 'bignumber.js'
import { SerializedFarmConfig } from 'config/constants/types'
import { getFullDecimalMultiplier } from '@pancakeswap/utils/getFullDecimalMultiplier'
import { BIG_TWO, BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { SerializedFarm } from '@pancakeswap/farms'
import { fetchMasterChefData } from './fetchMasterChefData'
import { fetchPublicFarmsData } from './fetchPublicFarmData'

function getLpInfo({
  tokenBalanceLP,
  quoteTokenBalanceLP,
  lpTokenBalanceMC,
  lpTotalSupply,
  tokenDecimals,
  quoteTokenDecimals,
}) {
  const lpTotalSupplyBN = new BigNumber(lpTotalSupply)

  // Ratio in % of LP tokens that are staked in the MC, vs the total number in circulation
  const lpTokenRatio = new BigNumber(lpTokenBalanceMC).div(new BigNumber(lpTotalSupplyBN))

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
    lpTotalSupply: lpTotalSupplyBN.toJSON(),
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
    ] = farmResult[index]

    const [info, totalRegularAllocPoint] = masterChefResult[index]
    const allocPoint = info ? new BigNumber(info.allocPoint?._hex) : BIG_ZERO
    const poolWeight = totalRegularAllocPoint ? allocPoint.div(new BigNumber(totalRegularAllocPoint)) : BIG_ZERO

    return {
      ...farm,
      token: farm.token,
      quoteToken: farm.quoteToken,
      poolWeight: poolWeight.toJSON(),
      multiplier: `${allocPoint.div(10).toString()}X`,
      ...getLpInfo({
        tokenBalanceLP,
        quoteTokenBalanceLP,
        lpTokenBalanceMC,
        lpTotalSupply,
        tokenDecimals,
        quoteTokenDecimals,
      }),
    }
  }
}

const fetchFarms = async (farmsToFetch: SerializedFarmConfig[], chainId: number): Promise<SerializedFarm[]> => {
  const [farmResult, masterChefResult] = await Promise.all([
    fetchPublicFarmsData(farmsToFetch, chainId),
    fetchMasterChefData(farmsToFetch, chainId),
  ])

  return farmsToFetch.map(farmLpTransformer(farmResult, masterChefResult))
}

export default fetchFarms
