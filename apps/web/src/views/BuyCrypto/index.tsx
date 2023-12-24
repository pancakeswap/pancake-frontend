import { useState } from 'react'
import { useDefaultsFromURLSearch } from 'state/buyCrypto/hooks'
import { CryptoFormView } from 'views/BuyCrypto/types'
import { useAccount } from 'wagmi'
import Page from '../Page'
import { OnRampFaqs } from './components/FAQ'
import { BuyCryptoForm } from './containers/BuyCryptoForm'
import { CryptoQuoteForm } from './containers/CryptoQuoteForm'
import usePriceQuotes from './hooks/usePriceQuoter'
import { StyledAppBody } from './styles'

export default function BuyCrypto() {
  const [modalView, setModalView] = useState<CryptoFormView>(CryptoFormView.Input)
  const { address } = useAccount()
  useDefaultsFromURLSearch(address)
  const { fetchQuotes, quotes, isAvailabilitiesLoading, providerAvailabilities } = usePriceQuotes()

  return (
    <Page>
      <StyledAppBody mb="24px">
        {modalView === CryptoFormView.Input ? (
          <BuyCryptoForm
            setModalView={setModalView}
            fetchQuotes={fetchQuotes}
            isAvailabilitiesLoading={isAvailabilitiesLoading}
            providerAvailabilities={providerAvailabilities}
          />
        ) : (
          <CryptoQuoteForm
            setModalView={setModalView}
            fetchQuotes={fetchQuotes}
            combinedQuotes={quotes}
            providerAvailabilities={providerAvailabilities}
          />
        )}
      </StyledAppBody>
      <StyledAppBody>
        <OnRampFaqs />
      </StyledAppBody>
    </Page>
  )
}
