import { AptosCoin, Coin, CurrencyAmount, Token } from '@pancakeswap/aptos-swap-sdk'
import { APTOS_COIN, useAccount, useAccountBalance, isHexStringEquals } from '@pancakeswap/awgmi'
import { useAllTokens } from './Tokens'
import useNativeCurrency from './useNativeCurrency'
import { useActiveChainId } from './useNetwork'

export function useCurrencyBalance(coinId?: string): CurrencyAmount<Token | AptosCoin> | undefined {
  const allTokens = useAllTokens()
  const { account } = useAccount()
  const native = useNativeCurrency()
  const chainId = useActiveChainId()

  const { data } = useAccountBalance({
    enabled: Boolean(coinId),
    address: account?.address,
    coin: coinId,
    watch: true,
    select: (coin) => {
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
  })

  return data
}
