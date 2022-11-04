import { AptosClient } from 'aptos'
import BigNumber from 'bignumber.js'
import type { SerializedClassicFarmConfig } from '@pancakeswap/farms'
import { getFarmConfig } from 'config/constants/farms'
import { BIG_TWO, BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { SWAP_ADDRESS, PAIR_RESERVE_TYPE_TAG } from '@pancakeswap/aptos-swap-sdk'
import { unwrapTypeFromString, wrapCoinInfoTypeTag } from '@pancakeswap/awgmi/core'
import { FarmResourcePoolInfo } from 'state/farms/types'
import { getFullDecimalMultiplier } from '@pancakeswap/utils/getFullDecimalMultiplier'

interface FetchLpInfoProps {
  provider: AptosClient
  chainId: number
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

export const fetchLpInfo = async ({
  provider,
  chainId,
  singlePoolInfo,
  lpAddress,
}: FetchLpInfoProps): Promise<LpInfo> => {
  const farmConfig = getFarmConfig(chainId)
  const token = farmConfig.find(
    (config) => config.lpAddress.toLowerCase() === lpAddress.toLowerCase(),
  ) as SerializedClassicFarmConfig

  const getLpTokenInfo = await provider.getAccountResources(SWAP_ADDRESS)
  const lpTokenInfo = getLpTokenInfo.filter(
    (lp) => lp.type.toLowerCase() === wrapCoinInfoTypeTag(lpAddress).toLowerCase(),
  )?.[0]?.data
  const lpTotalSupply = (lpTokenInfo as any)?.supply.vec[0].integer.vec[0].value

  let tokenBalanceLP = BIG_ZERO
  let quoteTokenBalanceLP = BIG_ZERO
  const tokenDecimals = token.token.decimals
  const quoteTokenDecimals = token.quoteToken.decimals
  const lpTokens = unwrapTypeFromString(lpAddress)
  if (lpTokens) {
    const pairReserveTag = `${PAIR_RESERVE_TYPE_TAG}<${lpTokens}>`
    const tokenPairReserve = getLpTokenInfo.find((i) => i.type.toLowerCase() === pairReserveTag.toLowerCase())
    quoteTokenBalanceLP = new BigNumber((tokenPairReserve as any)?.data?.reserve_x)
    tokenBalanceLP = new BigNumber((tokenPairReserve as any)?.data?.reserve_y)
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
