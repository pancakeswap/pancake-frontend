import styled from 'styled-components'
import { ModalBody, ModalContainer, Message, ModalHeader, Box, Heading } from '@pancakeswap/uikit'
import useTheme from 'hooks/useTheme'
import { useTranslation } from '@pancakeswap/localization'
import { WrappedTokenInfo } from '@pancakeswap/token-lists'
import SwapWarningTokensConfig from 'config/constants/swapWarningTokens'
import SafemoonWarning from './SafemoonWarning'
import ItamWarning from './ItamWarning'
import BondlyWarning from './BondlyWarning'
import Acknowledgement from './Acknowledgement'
import CcarWarning from './CcarWarning'
import BTTWarning from './BTTWarning'
import RugPullWarning from './RugPullWarning'
import FREEWarning from './FREEWarning'

const StyledModalContainer = styled(ModalContainer)`
  max-width: 440px;
`

const MessageContainer = styled(Message)`
  align-items: flex-start;
  justify-content: flex-start;
`

interface SwapWarningModalProps {
  swapCurrency: WrappedTokenInfo
  onDismiss?: () => void
}

const SwapWarningModal: React.FC<React.PropsWithChildren<SwapWarningModalProps>> = ({ swapCurrency, onDismiss }) => {
  const { t } = useTranslation()
  const { theme } = useTheme()

  const TOKEN_WARNINGS = {
    [SwapWarningTokensConfig.safemoon.address]: {
      symbol: SwapWarningTokensConfig.safemoon.symbol,
      component: <SafemoonWarning />,
    },
    [SwapWarningTokensConfig.bondly.address]: {
      symbol: SwapWarningTokensConfig.bondly.symbol,
      component: <BondlyWarning />,
    },
    [SwapWarningTokensConfig.itam.address]: {
      symbol: SwapWarningTokensConfig.itam.symbol,
      component: <ItamWarning />,
    },
    [SwapWarningTokensConfig.ccar.address]: {
      symbol: SwapWarningTokensConfig.ccar.symbol,
      component: <CcarWarning />,
    },
    [SwapWarningTokensConfig.bttold.address]: {
      symbol: SwapWarningTokensConfig.bttold.symbol,
      component: <BTTWarning />,
    },
    [SwapWarningTokensConfig.pokemoney.address]: {
      symbol: SwapWarningTokensConfig.pokemoney.symbol,
      component: <RugPullWarning />,
    },
    [SwapWarningTokensConfig.free.address]: {
      symbol: SwapWarningTokensConfig.free.symbol,
      component: <FREEWarning />,
    },
  }

  const SWAP_WARNING = TOKEN_WARNINGS[swapCurrency.address]

  return (
    <StyledModalContainer $minWidth="280px">
      <ModalHeader background={theme.colors.gradientCardHeader}>
        <Heading p="12px 24px">{t('Notice for trading %symbol%', { symbol: SWAP_WARNING.symbol })}</Heading>
      </ModalHeader>
      <ModalBody p="24px">
        <MessageContainer variant="warning" mb="24px">
          <Box>{SWAP_WARNING.component}</Box>
        </MessageContainer>
        <Acknowledgement handleContinueClick={onDismiss} />
      </ModalBody>
    </StyledModalContainer>
  )
}

export default SwapWarningModal
