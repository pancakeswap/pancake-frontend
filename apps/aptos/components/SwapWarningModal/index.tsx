import styled from 'styled-components'
import {
  ModalBody,
  ModalContainer,
  Message,
  ModalHeader,
  Box,
  Heading,
  Acknowledgement,
  useModal,
} from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import _noop from 'lodash/noop'
import { useCallback, useState, useEffect } from 'react'

import { Currency } from '@pancakeswap/aptos-swap-sdk'
import currencyId from 'utils/currencyId'
import TOKEN_WARNINGS from './config'

const StyledModalContainer = styled(ModalContainer)`
  max-width: 440px;
`

const MessageContainer = styled(Message)`
  align-items: flex-start;
  justify-content: flex-start;
`

interface SwapWarningModalProps {
  swapCurrency: Currency
  onDismiss?: () => void
}

export function useWarningSwapModal() {
  const [swapWarningCurrency, setSwapWarningCurrency] = useState<Currency | null>(null)

  const [onPresentSwapWarningModal] = useModal(
    swapWarningCurrency ? <SwapWarningModal swapCurrency={swapWarningCurrency} /> : null,
    false,
  )

  const shouldShowWarningModal = useCallback((warningCurrencyInput: Currency) => {
    const isWarningCurrency = Boolean(TOKEN_WARNINGS[currencyId(warningCurrencyInput)])

    setSwapWarningCurrency(isWarningCurrency ? warningCurrencyInput : null)
  }, [])

  useEffect(() => {
    if (swapWarningCurrency) {
      onPresentSwapWarningModal()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [swapWarningCurrency])

  return shouldShowWarningModal
}

const SwapWarningModal: React.FC<React.PropsWithChildren<SwapWarningModalProps>> = ({
  swapCurrency,
  onDismiss = _noop,
}) => {
  const { t } = useTranslation()

  const { component: WarningComponent, symbol } = TOKEN_WARNINGS[currencyId(swapCurrency)]

  return (
    <StyledModalContainer minWidth="280px">
      <ModalHeader background="gradientCardHeader">
        <Heading p="12px 24px">{t('Notice for trading %symbol%', { symbol })}</Heading>
      </ModalHeader>
      <ModalBody p="24px">
        <MessageContainer variant="warning" mb="24px">
          <Box>
            <WarningComponent />
          </Box>
        </MessageContainer>
        <Acknowledgement handleContinueClick={onDismiss} />
      </ModalBody>
    </StyledModalContainer>
  )
}

export default SwapWarningModal
