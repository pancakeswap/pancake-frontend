import { Flex } from '@pancakeswap/uikit'
import { AppBody } from 'components/App'
import { useState } from 'react'
import { useBuyCryptoActionHandlers, useBuyCryptoState, useDefaultsFromURLSearch } from 'state/buyCrypto/hooks'
import { Field } from 'state/swap/actions'
import { useAccount } from 'wagmi'
import { CryptoFormView } from 'views/BuyCrypto/types'
import Page from '../Page'
import { BuyCryptoForm } from './containers/BuyCryptoForm'
import { CryptoQuoteForm } from './containers/CryptoQuoteForm'
import { StyledBuyCryptoContainer, AppWrapper } from './styles'
import usePriceQuotes from './hooks/usePriceQuoter'
import { OnRamoFaqs } from './components/FAQ'

export default function BuyCrypto({ userIp }: { userIp: string | null }) {
  const [modalView, setModalView] = useState<CryptoFormView>(CryptoFormView.Input)
  const { onUsersIp } = useBuyCryptoActionHandlers()
  const { address } = useAccount()
  useDefaultsFromURLSearch(address)
  const buyCryptoState = useBuyCryptoState()
  const {
    typedValue,
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId },
    userIpAddress,
  } = { ...buyCryptoState }

  onUsersIp(userIp)
  const { fetchQuotes, quotes: combinedQuotes } = usePriceQuotes(
    typedValue,
    inputCurrencyId,
    outputCurrencyId,
    userIpAddress,
  )

  return (
    <Page>
      <Flex marginBottom="30px" justifyContent="center" position="relative" alignItems="flex-start">
        <Flex flexDirection="column">
          <StyledBuyCryptoContainer>
            <AppWrapper>
              <AppBody>
                {modalView === CryptoFormView.Input ? (
                  <BuyCryptoForm
                    setModalView={setModalView}
                    modalView={modalView}
                    buyCryptoState={buyCryptoState}
                    fetchQuotes={fetchQuotes}
                  />
                ) : (
                  <CryptoQuoteForm
                    setModalView={setModalView}
                    buyCryptoState={buyCryptoState}
                    combinedQuotes={combinedQuotes}
                    fetchQuotes={fetchQuotes}
                  />
                )}
              </AppBody>
            </AppWrapper>
          </StyledBuyCryptoContainer>
        </Flex>
      </Flex>
      <StyledBuyCryptoContainer>
        <AppBody>
          <AppWrapper>
            <OnRamoFaqs />
          </AppWrapper>
        </AppBody>
      </StyledBuyCryptoContainer>
    </Page>
  )
}
