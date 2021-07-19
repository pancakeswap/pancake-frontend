import React, { useEffect } from 'react'
import styled from 'styled-components'
import { ModalBody, ModalContainer, ModalHeader, Box, ErrorIcon, Flex, Heading } from '@pancakeswap/uikit'
import useTheme from 'hooks/useTheme'
import { getAddress } from 'utils/addressHelpers'
import { useTranslation } from 'contexts/Localization'
import { WrappedTokenInfo } from 'state/lists/hooks'
import SwapWarningTokensConfig from 'config/constants/swapWarningTokens'
import SafemoonWarning from './SafemoonWarning'
import BondlyWarning from './BondlyWarning'
import Acknowledgement from './Acknowledgement'

const StyledModalContainer = styled(ModalContainer)`
  max-width: 440px;
`

const WarningMessageWrapper = styled(Flex)`
  border-radius: ${({ theme }) => theme.radii.default};
  align-items: flex-start;
  padding: 16px;
  margin-bottom: 24px;
  background-color: ${({ theme }) => theme.colors.warning}1A; /* Hex value for 0.1 opacity */
  border: 1px solid ${({ theme }) => theme.colors.warning};
`

interface SwapWarningModalProps {
  swapCurrency: WrappedTokenInfo
  onDismiss?: () => void
}

// Modal is fired by a useEffect and doesn't respond to closeOnOverlayClick prop being set to false
const usePreventModalOverlayClick = () => {
  useEffect(() => {
    const preventClickHandler = (e) => {
      e.stopPropagation()
      e.preventDefault()
      return false
    }

    document.querySelectorAll('[role="presentation"]').forEach((el) => {
      el.addEventListener('click', preventClickHandler, true)
    })

    return () => {
      document.querySelectorAll('[role="presentation"]').forEach((el) => {
        el.removeEventListener('click', preventClickHandler, true)
      })
    }
  }, [])
}

const SwapWarningModal: React.FC<SwapWarningModalProps> = ({ swapCurrency, onDismiss }) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  usePreventModalOverlayClick()

  const TOKEN_WARNINGS = {
    [getAddress(SwapWarningTokensConfig.safemoon.address)]: {
      symbol: SwapWarningTokensConfig.safemoon.symbol,
      component: <SafemoonWarning onDismiss={onDismiss} />,
    },
    [getAddress(SwapWarningTokensConfig.bondly.address)]: {
      symbol: SwapWarningTokensConfig.bondly.symbol,
      component: <BondlyWarning onDismiss={onDismiss} />,
    },
  }

  const SWAP_WARNING = TOKEN_WARNINGS[swapCurrency.address]

  return (
    <StyledModalContainer minWidth="280px">
      <ModalHeader background={theme.colors.gradients.cardHeader}>
        <Heading p="12px 24px">{t('Notice for trading %symbol%', { symbol: SWAP_WARNING.symbol })}</Heading>
      </ModalHeader>
      <ModalBody p="24px">
        <WarningMessageWrapper>
          <Box>
            <ErrorIcon height="24px" width="24px" color="warning" mr="8px" />
          </Box>
          <Box>{SWAP_WARNING.component}</Box>
        </WarningMessageWrapper>
        <Acknowledgement handleContinueClick={onDismiss} />
      </ModalBody>
    </StyledModalContainer>
  )
}

export default SwapWarningModal
