import { PriceOrder } from '@pancakeswap/price-api-sdk'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useCanBuyCrypto } from 'hooks/useCanBuyCrypto'
import { useMemo } from 'react'
import { useSwapCurrency } from '../../Swap/V3Swap/hooks/useSwapCurrency'
import { useUserInsufficientBalance } from './useUserInsufficientBalance'

export function useBuyCryptoInfo(order: PriceOrder | undefined): {
  shouldShowBuyCrypto: boolean
  buyCryptoLink: string
} {
  const isInsufficientBalance = useUserInsufficientBalance(order)
  const [inputCurrency] = useSwapCurrency()
  const { chainId } = useActiveChainId()
  const canBuyCrypto = useCanBuyCrypto({ chainId, currencySymbol: inputCurrency?.symbol })
  const shouldShowBuyCrypto = useMemo(
    () => isInsufficientBalance && canBuyCrypto,
    [isInsufficientBalance, canBuyCrypto],
  )
  const buyCryptoLink = useMemo(() => {
    return `/buy-crypto?outputCurrency=${inputCurrency?.symbol}_${chainId}`
  }, [inputCurrency, chainId])

  return { shouldShowBuyCrypto, buyCryptoLink }
}
