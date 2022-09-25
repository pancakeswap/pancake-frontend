import { AptosCoin, Coin, CurrencyAmount, Token } from '@pancakeswap/aptos-swap-sdk'
import { useAccount, useBalance, APTOS_COIN } from '@pancakeswap/awgmi'
import { useAllTokens } from './Tokens'
import useNativeCurrency from './useNativeCurrency'
import { useActiveChainId } from './useNetwork'

export function useCurrencyBalanceWithLoading(coinId?: string) {
  const allTokens = useAllTokens()
  const { account } = useAccount()
  const native = useNativeCurrency()
  const chainId = useActiveChainId()

  return useBalance({
    enabled: Boolean(coinId),
    address: account?.address,
    coin: coinId,
    select: (d) => {
      if (coinId && d) {
        const currency = allTokens[coinId]
          ? allTokens[coinId]
          : coinId === APTOS_COIN
          ? native
          : new Coin(chainId, coinId, d.decimals, d.symbol)
        return CurrencyAmount.fromRawAmount(currency, d.value)
      }
      return undefined
    },
  })
}

export function useCurrencyBalance(coinId?: string): CurrencyAmount<Token | AptosCoin> | undefined {
  const { data } = useCurrencyBalanceWithLoading(coinId)

  return data
}
