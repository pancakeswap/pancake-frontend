import { useEffect, useState } from 'react'
import { useBuyCryptoActionHandlers, useBuyCryptoState, useDefaultsFromURLSearch } from 'state/buyCrypto/hooks'
import { useAccount } from 'wagmi'
import { CryptoFormView } from 'views/BuyCrypto/types'
import Page from '../Page'
import { BuyCryptoForm } from './containers/BuyCryptoForm'
import { CryptoQuoteForm } from './containers/CryptoQuoteForm'
import { StyledApBody } from './styles'
import usePriceQuotes from './hooks/usePriceQuoter'
import { OnRamoFaqs } from './components/FAQ'

export default function BuyCrypto({ userIp }: { userIp: string | null }) {
  const [modalView, setModalView] = useState<CryptoFormView>(CryptoFormView.Input)
  const { onUsersIp, onIsNewCustomer } = useBuyCryptoActionHandlers()
  const { isNewCustomer } = useBuyCryptoState()
  const { address } = useAccount()
  useDefaultsFromURLSearch(address)
  onUsersIp(userIp)
  const { fetchQuotes, quotes } = usePriceQuotes()

  useEffect(() => {
    if (!isNewCustomer) return () => null
    const fetchInterval = setInterval(async () => {
      try {
        const moonpayCustomerResponse = await fetch(`https://pcs-on-ramp-api.com/checkItem?searchAddress=${address}`)
        const moonpayCustomerResult = await moonpayCustomerResponse.json()
        onIsNewCustomer(!moonpayCustomerResult.found)
      } catch (error) {
        throw new Error('failed to fetch customer details')
      }
    }, 20000)

    return () => clearInterval(fetchInterval)
  }, [isNewCustomer, address, onIsNewCustomer])

  return (
    <Page>
      <StyledApBody mb="24px">
        {modalView === CryptoFormView.Input ? (
          <BuyCryptoForm setModalView={setModalView} fetchQuotes={fetchQuotes} />
        ) : (
          <CryptoQuoteForm setModalView={setModalView} fetchQuotes={fetchQuotes} combinedQuotes={quotes} />
        )}
      </StyledApBody>
      <StyledApBody>
        <OnRamoFaqs />
      </StyledApBody>
    </Page>
  )
}
