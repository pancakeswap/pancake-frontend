import BigNumber from 'bignumber.js'
import { FarmConfig } from 'config/constants/types'
import masterchefABI from 'config/abi/masterchef.json'
import erc20 from 'config/abi/erc20.json'
import { getAddress, getMasterChefAddress } from 'utils/addressHelpers'
import { BIG_TEN } from 'utils/bigNumber'
import multicall from 'utils/multicall'

const fetchFarm = async (farm: FarmConfig) => {
  const lpAddress = getAddress(farm.lpAddresses)
  const calls = [
    // Balance of token in the LP contract
    {
      address: getAddress(farm.token.address),
      name: 'balanceOf',
      params: [lpAddress],
    },
    // Balance of quote token on LP contract
    {
      address: getAddress(farm.quoteToken.address),
      name: 'balanceOf',
      params: [lpAddress],
    },
    // Balance of LP tokens in the master chef contract
    {
      address: lpAddress,
      name: 'balanceOf',
      params: [getMasterChefAddress()],
    },
    // Total supply of LP tokens
    {
      address: lpAddress,
      name: 'totalSupply',
    },
    // Token decimals
    {
      address: getAddress(farm.token.address),
      name: 'decimals',
    },
    // Quote token decimals
    {
      address: getAddress(farm.quoteToken.address),
      name: 'decimals',
    },
  ]

  const [tokenBalanceLP, quoteTokenBalanceLP, lpTokenBalanceMC, lpTotalSupply, tokenDecimals, quoteTokenDecimals] =
    await multicall(erc20, calls)

  // Ratio in % of LP tokens that are staked in the MC, vs the total number in circulation
  const lpTokenRatio = new BigNumber(lpTokenBalanceMC).div(new BigNumber(lpTotalSupply))

  // Raw amount of token in the LP, including those not staked
  const tokenAmountTotal = new BigNumber(tokenBalanceLP).div(BIG_TEN.pow(tokenDecimals))
  const quoteTokenAmountTotal = new BigNumber(quoteTokenBalanceLP).div(BIG_TEN.pow(quoteTokenDecimals))

  // Amount of token in the LP that are staked in the MC (i.e amount of token * lp ratio)
  const tokenAmountMc = tokenAmountTotal.times(lpTokenRatio)
  const quoteTokenAmountMc = quoteTokenAmountTotal.times(lpTokenRatio)

  // Total staked in LP, in quote token value
  const lpTotalInQuoteToken = quoteTokenAmountMc.times(new BigNumber(2))

  const [info, totalAllocPoint] = await multicall(masterchefABI, [
    {
      address: getMasterChefAddress(),
      name: 'poolInfo',
      params: [farm.pid],
    },
    {
      address: getMasterChefAddress(),
      name: 'totalAllocPoint',
    },
  ])

  const allocPoint = new BigNumber(info.allocPoint._hex)
  const poolWeight = allocPoint.div(new BigNumber(totalAllocPoint))

  return {
    ...farm,
    tokenAmountMc: tokenAmountMc.toJSON(),
    quoteTokenAmountMc: quoteTokenAmountMc.toJSON(),
    tokenAmountTotal: tokenAmountTotal.toJSON(),
    quoteTokenAmountTotal: quoteTokenAmountTotal.toJSON(),
    lpTotalSupply: new BigNumber(lpTotalSupply).toJSON(),
    lpTotalInQuoteToken: lpTotalInQuoteToken.toJSON(),
    tokenPriceVsQuote: quoteTokenAmountTotal.div(tokenAmountTotal).toJSON(),
    poolWeight: poolWeight.toJSON(),
    multiplier: `${allocPoint.div(100).toString()}X`,
  }
}

export default fetchFarm
