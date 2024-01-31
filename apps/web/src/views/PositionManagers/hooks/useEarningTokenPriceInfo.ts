import { Currency } from '@pancakeswap/sdk'
import { getBalanceAmount } from '@pancakeswap/utils/formatBalance'
import BigNumber from 'bignumber.js'
import { useCakePrice } from 'hooks/useCakePrice'
import { useCurrencyUsdPrice } from 'hooks/useCurrencyUsdPrice'
import { useMemo } from 'react'

export const useEarningTokenPriceInfo = (earningToken: Currency, pendingReward: bigint | undefined) => {
  const { data: earningTokenPrice } = useCurrencyUsdPrice(earningToken ?? undefined)
  const cakePrice = useCakePrice()?.toNumber()

  const earningsBalance = useMemo(
    () => getBalanceAmount(new BigNumber(pendingReward?.toString() ?? 0), earningToken.decimals).toNumber(),
    [pendingReward, earningToken],
  )

  const earningUsdValue = useMemo(
    () =>
      new BigNumber(earningsBalance)
        .times((earningToken.symbol === 'CAKE' ? cakePrice : earningTokenPrice) ?? 0)
        .toNumber(),
    [earningsBalance, earningToken.symbol, cakePrice, earningTokenPrice],
  )
  return { earningUsdValue, earningTokenPrice: earningTokenPrice ?? cakePrice, earningsBalance }
}
