import { Box, Button, Flex, Progress, Text, useModal } from '@pancakeswap/uikit'
import { useWeb3React } from '@web3-react/core'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { useTranslation } from 'contexts/Localization'
import useTheme from 'hooks/useTheme'
import React from 'react'
import HeaderBottomWave from '../../assets/HeaderBottomWave'
import BuyTicketsModal from '../Modals/BuyTickets'
import ConfirmModal from '../Modals/Confirm'
import EnableModal from '../Modals/Enable'
import {
  StyledHeaderWaveContainer,
  StyledSquadEventBorder,
  StyledSquadEventContainer,
  StyledSquadHeaderContainer,
} from './styles'

const PancakeSquadHeader: React.FC = () => {
  const { account } = useWeb3React()
  const { t } = useTranslation()
  const { theme } = useTheme()

  const [onPresentConfirmModal] = useModal(
    <ConfirmModal title={t('Confirm')} headerBackground={theme.colors.gradients.cardHeader} />,
  )
  const [onPresentEnableModal] = useModal(
    <EnableModal title={t('Enable')} headerBackground={theme.colors.gradients.cardHeader} />,
  )
  const [onPresentBuyTicketsModal] = useModal(
    <BuyTicketsModal
      title={t('Buy Minting Tickets')}
      onSuccess={onPresentConfirmModal}
      headerBackground={theme.colors.gradients.cardHeader}
    />,
  )

  return (
    <StyledSquadHeaderContainer flexDirection="column" alignItems="center">
      <Text fontSize="64px" my="32px" color="invertedContrast" bold>
        {t('Pancake Squad')}
      </Text>
      <Text color="warning" bold>
        {t('Mint Cost: 5 CAKE each')}
      </Text>
      <Text color="invertedContrast" mb="32px">
        {t('PancakeSwap’s first official generative NFT collection. Join the squad.')}
      </Text>
      <StyledSquadEventBorder mb="56px">
        <StyledSquadEventContainer m="1px" p="32px">
          <Flex>
            <Flex flexDirection="column">
              <Text color="invertedContrast" mb="24px" bold>
                {t('%remaining% of %total% remaining')}
              </Text>
              <Box mb="24px">
                <Progress variant="round" primaryStep={20} />
              </Box>
              {!account ? (
                <Box>
                  <ConnectWalletButton scale="sm" />
                </Box>
              ) : (
                <Box>
                  <Button onClick={onPresentBuyTicketsModal} scale="sm">
                    {t('Buy Tickets')}
                  </Button>
                </Box>
              )}
            </Flex>
          </Flex>
        </StyledSquadEventContainer>
      </StyledSquadEventBorder>
      <StyledHeaderWaveContainer>
        <HeaderBottomWave />
      </StyledHeaderWaveContainer>
    </StyledSquadHeaderContainer>
  )
}

export default PancakeSquadHeader
