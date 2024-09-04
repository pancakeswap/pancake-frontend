import { ChainId } from '@pancakeswap/chains'
import { useTranslation } from '@pancakeswap/localization'
import { WrappedTokenInfo } from '@pancakeswap/token-lists'
import { Acknowledgement, Box, Heading, Message, ModalBody, ModalContainer, ModalHeader } from '@pancakeswap/uikit'
import { useActiveChainId } from 'hooks/useActiveChainId'
import useTheme from 'hooks/useTheme'
import { styled } from 'styled-components'
import ARB_WARNING_LIST from './arbitrum'
import BASE_WARNING_LIST from './base'
import BSC_WARNING_LIST from './bsc'
import ETH_WARNING_LIST from './mainnet'
import ZKSYNC_WARNING_LIST from './zksync'

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
  const { chainId } = useActiveChainId()

  const TOKEN_WARNINGS = {
    [ChainId.ETHEREUM]: ETH_WARNING_LIST,
    [ChainId.BSC]: BSC_WARNING_LIST,
    [ChainId.ZKSYNC]: ZKSYNC_WARNING_LIST,
    [ChainId.BASE]: BASE_WARNING_LIST,
    [ChainId.ARBITRUM_ONE]: ARB_WARNING_LIST,
  }

  const SWAP_WARNING = chainId ? TOKEN_WARNINGS?.[chainId]?.[swapCurrency.address] : undefined

  return (
    <StyledModalContainer minWidth="280px">
      <ModalHeader background={theme.colors.gradientCardHeader}>
        <Heading p="12px 24px">{t('Notice for trading %symbol%', { symbol: SWAP_WARNING?.symbol })}</Heading>
      </ModalHeader>
      <ModalBody p="24px">
        <MessageContainer variant="warning" mb="24px">
          <Box>{SWAP_WARNING?.component}</Box>
        </MessageContainer>
        <Acknowledgement handleContinueClick={onDismiss} />
      </ModalBody>
    </StyledModalContainer>
  )
}

export default SwapWarningModal
