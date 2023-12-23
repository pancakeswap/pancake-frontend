import { ONRAMP_API_BASE_URL } from 'config/constants/endpoints'
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

export default function BuyCrypto({ userIp }: { userIp: string | null }) {
  const [modalView, setModalView] = useState<CryptoFormView>(CryptoFormView.Input)
  const { onUsersIp } = useBuyCryptoActionHandlers()
  const { address } = useAccount()
  useDefaultsFromURLSearch(address)
  // onUsersIp(userIp)
  const { fetchQuotes, quotes, providerAvailabilities } = usePriceQuotes()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${ONRAMP_API_BASE_URL}/user-ip`)
        const data = await response.json()
        onUsersIp(data?.ipAddress)
        console.log(data?.ipAddress)
      } catch (error) {
        console.error('Error fetching user IP:', error)
      }
    }

    fetchData()
  }, [onUsersIp])
  console.log(providerAvailabilities)
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
