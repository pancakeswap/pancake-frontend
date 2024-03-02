import { useState } from 'react'
import { useDefaultsFromURLSearch } from 'state/buyCrypto/hooks'
import { CryptoFormView } from 'views/BuyCrypto/types'
import { useAccount } from 'wagmi'
import Page from '../Page'
import { OnRampFaqs } from './components/FAQ'
import { BuyCryptoForm } from './containers/BuyCryptoForm'
import { StyledAppBody } from './styles'

export default function BuyCrypto() {
  const [modalView, setModalView] = useState<CryptoFormView>(CryptoFormView.Input)
  const { address } = useAccount()
  useDefaultsFromURLSearch(address)

  return (
    <Page>
      <StyledAppBody mb="24px">
        {/* {modalView === CryptoFormView.Input ? (
          <BuyCryptoForm setModalView={setModalView} />
        ) : (
          <CryptoQuoteForm setModalView={setModalView} fetchQuotes={() => null} combinedQuotes={quotes} />
        )} */}
        <BuyCryptoForm setModalView={setModalView} />
      </StyledAppBody>
      <StyledAppBody>
        <OnRampFaqs />
      </StyledAppBody>
    </Page>
  )
}
