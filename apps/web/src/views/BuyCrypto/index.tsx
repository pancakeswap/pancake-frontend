import { Flex } from '@pancakeswap/uikit'
import { AppBody } from 'components/App'
import { useState } from 'react'
import { useBuyCryptoActionHandlers, useBuyCryptoState, useDefaultsFromURLSearch } from 'state/buyCrypto/hooks'
import { Field } from 'state/swap/actions'
import { useAccount } from 'wagmi'
import Page from '../Page'
// eslint-disable-next-line import/no-cycle
import { BuyCryptoForum } from './containers/BuyCryptoForum'
// eslint-disable-next-line import/no-cycle
import { CryptoQuoteForm } from './containers/CryptoQuoteForm'
import { StyledBuyCryptoContainer, StyledInputCurrencyWrapper } from './styles'
import usePriceQuotes from './hooks/usePriceQuoter'
import { OnRamoFaqs } from './components/FAQ'

export enum CryptoFormView {
  Input,
  Quote,
}

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
      <Flex
        width={['328px', '100%']}
        marginBottom="30px"
        justifyContent="center"
        position="relative"
        alignItems="flex-start"
      >
        <Flex flexDirection="column">
          <StyledBuyCryptoContainer>
            <StyledInputCurrencyWrapper>
              <AppBody>
                {modalView === CryptoFormView.Input ? (
                  <BuyCryptoForum
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
            </StyledInputCurrencyWrapper>
          </StyledBuyCryptoContainer>
        </Flex>
      </Flex>
      <StyledBuyCryptoContainer>
        <StyledInputCurrencyWrapper>
          <AppBody>
            <OnRamoFaqs />
          </AppBody>
        </StyledInputCurrencyWrapper>
      </StyledBuyCryptoContainer>
    </Page>
  )
}
