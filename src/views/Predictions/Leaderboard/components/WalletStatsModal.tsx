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
  Skeleton,
  Heading,
} from '@pancakeswap/uikit'
import { useGetProfileAvatar } from 'state/profile/hooks'
import useTheme from 'hooks/useTheme'
import styled from 'styled-components'
import { getBscScanLink } from 'utils'
import truncateWalletAddress from 'utils/truncateWalletAddress'
import { useGetLeaderboardAddressResult } from 'state/predictions/hooks'
import { useTranslation } from 'contexts/Localization'
import { NetWinnings } from './Results/styles'
import MobileBetsTable from './MobileBetsTable'
import DesktopBetsTable from './Results/DesktopBetsTable'

interface WalletStatsModalProps extends InjectedModalProps {
  account: string
  onBeforeDismiss?: () => void
}

const ExternalLink = styled(LinkExternal)`
  color: ${({ theme }) => theme.colors.text};

  svg {
    fill: ${({ theme }) => theme.colors.text};
  }
`

const WalletStatsModal: React.FC<WalletStatsModalProps> = ({ account, onDismiss, onBeforeDismiss }) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const result = useGetLeaderboardAddressResult(account)
  const profileAvatar = useGetProfileAvatar(account)
  const { isXl } = useMatchBreakpoints()

  const handleDismiss = () => {
    if (onBeforeDismiss) {
      onBeforeDismiss()
    }

    onDismiss()
  }

  return (
    <ModalContainer minWidth="320px">
      <ModalHeader background={theme.colors.gradients.bubblegum}>
        <Flex alignItems="center" style={{ flex: 1 }}>
          <Box width={['64px', null, null, null, '96px']} mr="16px">
            <ProfileAvatar src={`/images/nfts/${profileAvatar.nft?.images?.md}`} height={96} width={96} />
          </Box>
          <Box>
            {profileAvatar.username ? (
              <Heading scale="lg" mb="8px">
                {profileAvatar.username}
              </Heading>
            ) : (
              <Skeleton mb="8px" />
            )}
            <ExternalLink href={getBscScanLink(account, 'address')}>{truncateWalletAddress(account)}</ExternalLink>
          </Box>
        </Flex>
        <IconButton variant="text" onClick={handleDismiss} aria-label="Close the dialog">
          <CloseIcon color="text" width="24px" />
        </IconButton>
      </ModalHeader>
      <Box maxHeight={['500px', null, null, null, 'none']} overflowY="auto">
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
            {result ? <NetWinnings amount={result.netBNB} alignItems="start" /> : <Skeleton />}
          </Box>
          <Box>
            <Text as="h6" fontSize="12px" textTransform="uppercase" color="secondary" fontWeight="bold" mb="8px">
              {t('Win Rate')}
            </Text>
            {result ? (
              <Text fontWeight="bold">{`${result.winRate.toLocaleString(undefined, {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
              })}%`}</Text>
            ) : (
              <Skeleton />
            )}
          </Box>
          <Box>
            <Text as="h6" fontSize="12px" textTransform="uppercase" color="secondary" fontWeight="bold" mb="8px">
              {t('Rounds Won')}
            </Text>
            {result ? <Text fontWeight="bold">{result.totalBetsClaimed.toLocaleString()}</Text> : <Skeleton />}
          </Box>
          <Box>
            <Text as="h6" fontSize="12px" textTransform="uppercase" color="secondary" fontWeight="bold" mb="8px">
              {t('Rounds Played')}
            </Text>
            {result ? <Text fontWeight="bold">{result.totalBets.toLocaleString()}</Text> : <Skeleton />}
          </Box>
        </Grid>
        {isXl ? <DesktopBetsTable account={account} /> : <MobileBetsTable account={account} />}
      </Box>
    </ModalContainer>
  )
}

export default WalletStatsModal
