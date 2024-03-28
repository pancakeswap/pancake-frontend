import { ChainId } from '@pancakeswap/chains'
import { styled } from 'styled-components'
import { ModalBody, Message, ModalHeader, Box, Heading, Modal } from '@pancakeswap/uikit'
import useTheme from 'hooks/useTheme'
import { useTranslation } from '@pancakeswap/localization'
import { WrappedTokenInfo } from '@pancakeswap/token-lists'
import { useActiveChainId } from 'hooks/useActiveChainId'
import ETH_WARNING_LIST from './1'
import BSC_WARNING_LIST from './56'
import Acknowledgement from './Acknowledgement'

const MessageContainer = styled(Message)`
  align-items: flex-start;
  justify-content: flex-start;
`

interface SwapWarningModalProps {
  swapCurrency: WrappedTokenInfo
  onDismiss?: () => void
  customOnDismiss?: () => void
}

const SwapWarningModal: React.FC<React.PropsWithChildren<SwapWarningModalProps>> = ({
  swapCurrency,
  customOnDismiss,
  onDismiss,
}) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { chainId } = useActiveChainId()

  const TOKEN_WARNINGS = {
    [ChainId.ETHEREUM]: ETH_WARNING_LIST,
    [ChainId.BSC]: BSC_WARNING_LIST,
  }

  const SWAP_WARNING = chainId ? TOKEN_WARNINGS?.[chainId]?.[swapCurrency.address] : undefined

  return (
    <Modal
      title={t('Warning')}
      onDismiss={() => {
        customOnDismiss?.()
        onDismiss?.()
      }}
    >
      <ModalHeader mb="8px" background={theme.colors.gradientCardHeader}>
        <Heading p="8px">{t('Notice for trading %symbol%', { symbol: SWAP_WARNING?.symbol })}</Heading>
      </ModalHeader>
      <ModalBody>
        <MessageContainer variant="warning" mb="8px">
          <Box>{SWAP_WARNING?.component}</Box>
        </MessageContainer>
        <Acknowledgement handleContinueClick={onDismiss} />
      </ModalBody>
    </Modal>
  )
}

export default SwapWarningModal
