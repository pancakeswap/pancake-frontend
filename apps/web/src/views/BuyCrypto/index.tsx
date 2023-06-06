import { Flex } from '@pancakeswap/uikit'
import { AppBody } from 'components/App'
import { useState } from 'react'
import { useBuyCryptoState, useDefaultsFromURLSearch } from 'state/buyCrypto/hooks'
import { Field } from 'state/swap/actions'

import Page from '../Page'
// eslint-disable-next-line import/no-cycle
import { BuyCryptoForum } from './containers/BuyCryptoForum'
// eslint-disable-next-line import/no-cycle
import { CryptoQuoteForm } from './containers/CryptoQuoteForm'
import { StyledBuyCryptoContainer, StyledInputCurrencyWrapper } from './styles'
import usePriceQuotes from './hooks/usePriceQuoter'

export enum CryptoFormView {
  Input,
  Quote,
}

export default function BuyCrypto() {
  const [modalView, setModalView] = useState<CryptoFormView>(CryptoFormView.Input)
  useDefaultsFromURLSearch()
  const buyCryptoState = useBuyCryptoState()
  const {
    typedValue,
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId },
  } = { ...buyCryptoState }

  const { fetchQuotes, quotes, combinedQuotes } = usePriceQuotes(typedValue, inputCurrencyId, outputCurrencyId)

  return (
    <Page>
      <Flex width={['328px', '100%']} height="100%" justifyContent="center" position="relative" alignItems="flex-start">
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
                  />
                )}
              </AppBody>
            </StyledInputCurrencyWrapper>
          </StyledBuyCryptoContainer>
        </Flex>
      </Flex>
    </Page>
  )
}
