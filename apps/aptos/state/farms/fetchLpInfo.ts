import { AptosClient } from 'aptos'
import BigNumber from 'bignumber.js'
import { BIG_TWO, BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { SWAP_ADDRESS } from '@pancakeswap/aptos-swap-sdk'
import {
  fetchCoin,
  FetchCoinResult,
  coinStoreResourcesFilter,
  unwrapTypeFromString,
  wrapCoinInfoTypeTag,
} from '@pancakeswap/awgmi/core'
import { FARMS_ADDRESS } from 'state/farms/constants'
import { FarmResourcePoolInfo } from 'state/farms/types'
import { getFullDecimalMultiplier } from '@pancakeswap/utils/getFullDecimalMultiplier'

interface FetchLpInfoProps {
  provider: AptosClient
  singlePoolInfo: FarmResourcePoolInfo
  lpAddress: string
}

interface LpInfo {
  tokenAmountTotal: string
  quoteTokenAmountTotal: string
  lpTotalSupply: string
  lpTotalInQuoteToken: string
  tokenPriceVsQuote: string
}

export const fetchLpInfo = async ({ provider, singlePoolInfo, lpAddress }: FetchLpInfoProps): Promise<LpInfo> => {
  const getLpTokenInfo = await provider.getAccountResources(SWAP_ADDRESS)
  const lpTokenInfo = getLpTokenInfo.filter(
    (lp) => lp.type.toLowerCase() === wrapCoinInfoTypeTag(lpAddress).toLowerCase(),
  )?.[0]?.data
  const lpTotalSupply = (lpTokenInfo as any)?.supply.vec[0].integer.vec[0].value

  const pcsAddressList = await provider.getAccountResource(FARMS_ADDRESS, '0x1::code::PackageRegistry')
  const pcsTokenAddress = (pcsAddressList as any).data.packages[0].deps.find(
    (dep) => dep.package_name === 'PancakeCakeToken',
  )?.account

  const coinStore = await provider.getAccountResources(pcsTokenAddress)
  const coinList = coinStore.filter(coinStoreResourcesFilter)

  const coinInfo: FetchCoinResult[] = []
  for await (const coin of coinList) {
    const response = await fetchCoin({ coin: unwrapTypeFromString(coin.type) })
    coinInfo.push({ ...response })
  }

  const tokenBalanceLP = BIG_ZERO
  const quoteTokenBalanceLP = BIG_ZERO
  let tokenDecimals = 0
  let quoteTokenDecimals = 0
  const lpTokens = unwrapTypeFromString(lpAddress)?.split(', ')

  if (lpTokens) {
    const quoteTokenAddress = lpTokens[0]
    const tokenAddress = lpTokens[1]

    quoteTokenDecimals =
      coinInfo.find((coin) => coin.address.toLowerCase() === quoteTokenAddress.toLowerCase())?.decimals ?? 0
    tokenDecimals = coinInfo.find((coin) => coin.address.toLowerCase() === tokenAddress.toLowerCase())?.decimals ?? 0
  }

  const lpTotalSupplyBN = new BigNumber(lpTotalSupply)

  // Ratio in % of LP tokens that are staked in the MC, vs the total number in circulation
  const lpTokenRatio = new BigNumber(singlePoolInfo.total_amount).div(new BigNumber(lpTotalSupplyBN))

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
