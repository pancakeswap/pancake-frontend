import { useActiveChainId } from 'hooks/useActiveChainId'
import { useCallback, useState } from 'react'
import { Field } from 'state/buyCrypto/actions'
import { useBuyCryptoState } from 'state/buyCrypto/hooks'
import { ProviderQuote } from '../types'
import { fetchProviderAvailabilities } from './useProviderAvailability'
import { fetchProviderQuotes } from './useProviderQuotes'

const usePriceQuotes = () => {
  const [quotes, setQuotes] = useState<ProviderQuote[]>([])
  const { chainId } = useActiveChainId()

  const {
    typedValue: amount,
    [Field.INPUT]: { currencyId: inputCurrency },
    [Field.OUTPUT]: { currencyId: outputCurrency },
    userIpAddress: userIp,
  } = useBuyCryptoState()

  const sortProviderQuotes = useCallback(
    async (combinedData: ProviderQuote[], disabledProviders: string[]) => {
      let sortedFilteredQuotes = combinedData
      try {
        if (userIp) {
          const providerAvailabilities = await fetchProviderAvailabilities({ userIp })
          sortedFilteredQuotes = combinedData.filter((quote: ProviderQuote) => {
            return providerAvailabilities[quote.provider] && !disabledProviders.includes(quote.provider)
          })
        }
        if (sortedFilteredQuotes.length === 0) return []
        if (sortedFilteredQuotes.length > 1) {
          if (sortedFilteredQuotes.every((quote) => quote.quote === 0)) return []
          sortedFilteredQuotes.sort((a, b) => b.quote - a.quote)
        }

        return sortedFilteredQuotes
      } catch (error) {
        console.error('Error fetching price quotes:', error)
        return []
      }
    },
    [userIp],
  )

  const fetchQuotes = useCallback(async () => {
    if (!chainId || !outputCurrency || !inputCurrency) return
    try {
      const providerQuotes = await fetchProviderQuotes({
        fiatCurrency: outputCurrency.toUpperCase(),
        cryptoCurrency: inputCurrency.toUpperCase(),
        fiatAmount: Number(amount).toString(),
        network: chainId,
      })
      const sortedFilteredQuotes = await sortProviderQuotes(providerQuotes, [])
      setQuotes(sortedFilteredQuotes)
    } catch (error) {
      console.error('Error fetching price quotes:', error)
      setQuotes([])
    }
  }, [amount, inputCurrency, outputCurrency, chainId, sortProviderQuotes])

  return { quotes, fetchQuotes, fetchProviderAvailability: sortProviderQuotes }
}

export default usePriceQuotes
