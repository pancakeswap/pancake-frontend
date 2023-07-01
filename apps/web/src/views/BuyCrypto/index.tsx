import { useState } from 'react'
import { useBuyCryptoActionHandlers, useDefaultsFromURLSearch } from 'state/buyCrypto/hooks'
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
  const { onUsersIp } = useBuyCryptoActionHandlers()
  const { address } = useAccount()
  useDefaultsFromURLSearch(address)
  onUsersIp(userIp)
  const { fetchQuotes, quotes } = usePriceQuotes()

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
