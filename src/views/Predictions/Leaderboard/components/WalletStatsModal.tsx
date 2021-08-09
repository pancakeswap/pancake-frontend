import React from 'react'
import {
  Box,
  CloseIcon,
  Flex,
  Grid,
  Text,
  IconButton,
  InjectedModalProps,
  LinkExternal,
  ModalContainer,
  ModalHeader,
  ProfileAvatar,
  useMatchBreakpoints,
} from '@pancakeswap/uikit'
import { useGetAccountResult } from 'state/predictions/hooks'
import { useGetProfileAvatar } from 'state/profile/hooks'
import useTheme from 'hooks/useTheme'
import styled from 'styled-components'
import { getBscScanLink } from 'utils'
import truncateWalletAddress from 'utils/truncateWalletAddress'
import { useTranslation } from 'contexts/Localization'
import { NetWinnings } from './Results/styles'
import MobileBetsTable from './MobileBetsTable'
import DesktopBetsTable from './Results/DesktopBetsTable'

interface WalletStatsModalProps extends InjectedModalProps {
  account: string
}

const ExternalLink = styled(LinkExternal)`
  color: ${({ theme }) => theme.colors.text};

  svg {
    fill: ${({ theme }) => theme.colors.text};
  }
`

const WalletStatsModal: React.FC<WalletStatsModalProps> = ({ account, onDismiss }) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const result = useGetAccountResult(account)
  const profileAvatar = useGetProfileAvatar(account)
  const { isXl } = useMatchBreakpoints()

  return (
    <ModalContainer minWidth="320px">
      <ModalHeader background={theme.colors.gradients.bubblegum}>
        <Flex alignItems="center" style={{ flex: 1 }}>
          <Box width={['64px', null, null, null, '96px']} mr="16px">
            <ProfileAvatar src={`/images/nfts/${profileAvatar.nft.images.md}`} height={96} width={96} />
          </Box>
          <Box>
            <ExternalLink href={getBscScanLink(account, 'address')}>{truncateWalletAddress(account)}</ExternalLink>
          </Box>
        </Flex>
        <IconButton variant="text" onClick={onDismiss} aria-label="Close the dialog">
          <CloseIcon color="text" width="24px" />
        </IconButton>
      </ModalHeader>
      <Grid
        gridTemplateColumns={['1fr', null, null, null, 'repeat(4, 1fr)']}
        gridGap="16px"
        p="24px"
        borderBottom="1px solid"
        borderColor="cardBorder"
      >
        <Box>
          <Text as="h6" fontSize="12px" textTransform="uppercase" color="secondary" fontWeight="bold" mb="8px">
            {t('Net Winnings')}
          </Text>
          <NetWinnings amount={result.netBNB} alignItems="start" />
        </Box>
        <Box>
          <Text as="h6" fontSize="12px" textTransform="uppercase" color="secondary" fontWeight="bold" mb="8px">
            {t('Win Rate')}
          </Text>
          <Text fontWeight="bold">{`${result.winRate.toLocaleString(undefined, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
          })}%`}</Text>
        </Box>
        <Box>
          <Text as="h6" fontSize="12px" textTransform="uppercase" color="secondary" fontWeight="bold" mb="8px">
            {t('Rounds Won')}
          </Text>
          <Text fontWeight="bold">{result.totalBetsClaimed.toLocaleString()}</Text>
        </Box>
        <Box>
          <Text as="h6" fontSize="12px" textTransform="uppercase" color="secondary" fontWeight="bold" mb="8px">
            {t('Rounds Played')}
          </Text>
          <Text fontWeight="bold">{result.totalBets.toLocaleString()}</Text>
        </Box>
      </Grid>
      {isXl ? <DesktopBetsTable account={account} /> : <MobileBetsTable account={account} />}
    </ModalContainer>
  )
}

export default WalletStatsModal
