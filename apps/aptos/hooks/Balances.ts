import { AptosCoin, Coin, CurrencyAmount, Token } from '@pancakeswap/aptos-swap-sdk'
import { APTOS_COIN, isHexStringEquals, useAccount, useAccountBalance } from '@pancakeswap/awgmi'
import { UseAccountBalancesResult } from '@pancakeswap/awgmi/src/hooks/useAccountBalances'
import { useCallback } from 'react'
import { useAllTokens } from './Tokens'
import useNativeCurrency from './useNativeCurrency'
import { useActiveChainId } from './useNetwork'

export function useCurrencyBalance(coinId?: string): CurrencyAmount<Token | AptosCoin> | undefined {
  const allTokens = useAllTokens()
  const { account } = useAccount()
  const native = useNativeCurrency()
  const chainId = useActiveChainId()

  const selector = useCallback(
    (coin: UseAccountBalancesResult) => {
      if (coinId && coin) {
        const currency = allTokens[coinId]
          ? allTokens[coinId]
          : isHexStringEquals(coinId, APTOS_COIN)
          ? native
          : new Coin(chainId, coinId, coin.decimals, coin.symbol)
        return CurrencyAmount.fromRawAmount(currency, coin.value)
      }
      return undefined
    },
    [allTokens, chainId, coinId, native],
  )

  const { data } = useAccountBalance({
    enabled: Boolean(coinId),
    address: account?.address,
    coin: coinId,
    watch: true,
    select: selector,
  })

  return data
}
