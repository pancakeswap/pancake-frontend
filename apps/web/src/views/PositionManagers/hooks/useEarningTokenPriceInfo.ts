import { Currency } from '@pancakeswap/sdk'
import { getBalanceAmount } from '@pancakeswap/utils/formatBalance'
import BigNumber from 'bignumber.js'
import { useCurrencyUsdPrice } from 'hooks/useCurrencyUsdPrice'
import { useMemo } from 'react'

export const useEarningTokenPriceInfo = (earningToken: Currency, pendingReward: bigint | undefined) => {
  const { data: earningTokenPrice } = useCurrencyUsdPrice(earningToken ?? undefined)
  const earningsBalance = useMemo(
    () => getBalanceAmount(new BigNumber(pendingReward?.toString() ?? 0), earningToken.decimals).toNumber(),
    [pendingReward, earningToken],
  )

  const earningUsdValue = useMemo(
    () => new BigNumber(earningsBalance).times(earningTokenPrice ?? 0).toNumber(),
    [earningsBalance, earningTokenPrice],
  )
  return { earningUsdValue, earningTokenPrice, earningsBalance }
}
