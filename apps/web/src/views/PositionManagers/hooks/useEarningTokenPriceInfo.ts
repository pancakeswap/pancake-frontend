import { useStablecoinPrice } from 'hooks/useBUSDPrice'
import { getBalanceAmount } from '@pancakeswap/utils/formatBalance'
import BigNumber from 'bignumber.js'
import { useMemo } from 'react'
import { Currency } from '@pancakeswap/sdk'

export const useEarningTokenPriceInfo = (earningToken: Currency, pendingReward: bigint | undefined) => {
  const earningTokenPrice = useStablecoinPrice(earningToken ?? undefined, { enabled: !!earningToken })
  const earningsBalance = useMemo(
    () => getBalanceAmount(new BigNumber(pendingReward?.toString() ?? 0), earningToken.decimals).toNumber(),
    [pendingReward, earningToken],
  )

  const earningUsdValue = useMemo(
    () => new BigNumber(earningsBalance).times(earningTokenPrice?.toSignificant() ?? 0).toNumber(),
    [earningsBalance, earningTokenPrice],
  )
  return { earningUsdValue, earningTokenPrice, earningsBalance }
}
