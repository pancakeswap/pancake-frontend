import React from 'react'
import { useWeb3React } from '@web3-react/core'
import { Box, Button, Text, useModal } from '@pancakeswap/uikit'
import useTheme from 'hooks/useTheme'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { useTranslation } from 'contexts/Localization'
import { StyledSquadHeaderContainer } from './styles'
import BuyTicketsModal from '../Modals/BuyTickets'
import ConfirmModal from '../Modals/Confirm'

const PancakeSquadHeader: React.FC = () => {
  const { account } = useWeb3React()
  const { t } = useTranslation()
  const { theme } = useTheme()
  const [onPresentConfirmModal] = useModal(
    <ConfirmModal title={t('Confirm')} headerBackground={theme.colors.gradients.cardHeader} />,
  )
  const [onPresentBuyTicketsModal] = useModal(
    <BuyTicketsModal
      title={t('Buy Minting Tickets')}
      onSuccess={onPresentConfirmModal}
      headerBackground={theme.colors.gradients.cardHeader}
    />,
  )

  return (
    <StyledSquadHeaderContainer flexDirection="column">
      <Text mb="32px">Pancake Squad</Text>
      {!account ? (
        <Box>
          <ConnectWalletButton scale="sm" />
        </Box>
      ) : (
        <Box>
          <Button onClick={onPresentBuyTicketsModal}>{t('Buy Tickets')}</Button>
        </Box>
      )}
    </StyledSquadHeaderContainer>
  )
}

export default PancakeSquadHeader
