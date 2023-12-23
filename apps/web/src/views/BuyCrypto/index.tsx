import Cookies from 'js-cookie'
import { useEffect, useState } from 'react'
import { useBuyCryptoActionHandlers, useDefaultsFromURLSearch } from 'state/buyCrypto/hooks'
import { CryptoFormView } from 'views/BuyCrypto/types'
import { useAccount } from 'wagmi'
import Page from '../Page'
import { OnRampFaqs } from './components/FAQ'
import { BuyCryptoForm } from './containers/BuyCryptoForm'
import { CryptoQuoteForm } from './containers/CryptoQuoteForm'
import usePriceQuotes from './hooks/usePriceQuoter'
import { StyledAppBody } from './styles'

export default function BuyCrypto({ userIp }: { userIp: string | undefined }) {
  const [modalView, setModalView] = useState<CryptoFormView>(CryptoFormView.Input)
  const { onUsersIp } = useBuyCryptoActionHandlers()
  const { address } = useAccount()
  useDefaultsFromURLSearch(address)
  // onUsersIp(userIp)
  const { fetchQuotes, quotes } = usePriceQuotes()

  console.log(userIp)
  useEffect(() => {
    onUsersIp(Cookies.get('p_client_ip'))
  }, [onUsersIp])
  return (
    <Page>
      <StyledAppBody mb="24px">
        {modalView === CryptoFormView.Input ? (
          <BuyCryptoForm setModalView={setModalView} fetchQuotes={fetchQuotes} />
        ) : (
          <CryptoQuoteForm setModalView={setModalView} fetchQuotes={fetchQuotes} combinedQuotes={quotes} />
        )}
      </StyledAppBody>
      <StyledAppBody>
        <OnRampFaqs />
      </StyledAppBody>
    </Page>
  )
}
