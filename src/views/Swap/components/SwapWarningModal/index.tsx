import React, { useEffect } from 'react'
import styled from 'styled-components'
import { ModalContainer, ModalHeader, Heading, ErrorIcon, ModalBody } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { WrappedTokenInfo } from 'state/lists/hooks'
import SwapWarningTokens from 'config/constants/swapWarningTokens'
import SafemoonWarning from './SafemoonWarning'
import BondlyWarning from './BondlyWarning'

const StyledModalContainer = styled(ModalContainer)`
  max-width: 420px;
  border: 1px ${({ theme }) => theme.colors.warning} solid;
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
  usePreventModalOverlayClick()
  const chainId = process.env.REACT_APP_CHAIN_ID

  const WARNING_DATA = {
    [SwapWarningTokens.safemoon.address[chainId]]: {
      symbol: SwapWarningTokens.safemoon.symbol,
      component: <SafemoonWarning onDismiss={onDismiss} />,
    },
    [SwapWarningTokens.bondly.address[chainId]]: {
      symbol: SwapWarningTokens.bondly.symbol,
      component: <BondlyWarning onDismiss={onDismiss} />,
    },
  }

  const SWAP_WARNING = WARNING_DATA[swapCurrency.address]

  return (
    <StyledModalContainer minWidth="320px">
      <ModalHeader>
        <ErrorIcon height="24px" width="24px" color="warning" mr="8px" />
        <Heading> {t('Notice for trading %symbol%', { symbol: SWAP_WARNING.symbol })}</Heading>
      </ModalHeader>
      <ModalBody p="24px">{SWAP_WARNING.component}</ModalBody>
    </StyledModalContainer>
  )
}

export default SwapWarningModal
