import { Flex } from '@pancakeswap/uikit'
import { AppBody } from 'components/App'
import { useState } from 'react'
import { useDefaultsFromURLSearch } from 'state/buyCrypto/hooks'

import Page from '../Page'
// eslint-disable-next-line import/no-cycle
import { BuyCryptoForum } from './containers/BuyCryptoForum'
// eslint-disable-next-line import/no-cycle
import { CryptoQuoteForm } from './containers/CryptoQuoteForm'
import { StyledBuyCryptoContainer, StyledInputCurrencyWrapper } from './styles'

export enum CryptoFormView {
  Input,
  Quote,
}

export default function BuyCrypto() {
  const [modalView, setModalView] = useState<CryptoFormView>(CryptoFormView.Input)
  useDefaultsFromURLSearch()

  return (
    <Page>
      <Flex width={['328px', '100%']} height="100%" justifyContent="center" position="relative" alignItems="flex-start">
        <Flex flexDirection="column">
          <StyledBuyCryptoContainer>
            <StyledInputCurrencyWrapper>
              <AppBody>
                {modalView === CryptoFormView.Input ? (
                  <BuyCryptoForum setModalView={setModalView} modalView={modalView} />
                ) : (
                  <CryptoQuoteForm setModalView={setModalView} />
                )}
              </AppBody>
            </StyledInputCurrencyWrapper>
          </StyledBuyCryptoContainer>
        </Flex>
      </Flex>
    </Page>
  )
}
