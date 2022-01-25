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
import truncateHash from 'utils/truncateHash'
import {
  useGetOrFetchLeaderboardAddressResult,
  useGetLeaderboardLoadingState,
  useGetSelectedAddress,
} from 'state/predictions/hooks'
import { useTranslation } from 'contexts/Localization'
import { FetchStatus } from 'config/constants/types'
import { NetWinnings } from './Results/styles'
import MobileBetsTable from './MobileBetsTable'
import DesktopBetsTable from './Results/DesktopBetsTable'

interface WalletStatsModalProps extends InjectedModalProps {
  account?: string
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
  const selectedAddress = useGetSelectedAddress()
  const address = account || selectedAddress
  const result = useGetOrFetchLeaderboardAddressResult(address)
  const profileAvatar = useGetProfileAvatar(address)
  const leaderboardLoadingState = useGetLeaderboardLoadingState()
  const isLoading = leaderboardLoadingState === FetchStatus.Fetching
  const { isDesktop } = useMatchBreakpoints()

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
          <Box width={['64px', null, null, null, null, null, '96px']} mr="16px">
            <ProfileAvatar src={profileAvatar.nft?.image?.thumbnail} height={96} width={96} />
          </Box>
          <Box>
            {profileAvatar.username && (
              <Heading scale="lg" mb="8px">
                {profileAvatar.username}
              </Heading>
            )}
            <ExternalLink href={getBscScanLink(address, 'address')}>{truncateHash(address)}</ExternalLink>
          </Box>
        </Flex>
        <IconButton variant="text" onClick={handleDismiss} aria-label="Close the dialog">
          <CloseIcon color="text" width="24px" />
        </IconButton>
      </ModalHeader>
      {result === null ? (
        <Text p="32px" textAlign="center" fontWeight="bold">
          {t('No results found.')}
        </Text>
      ) : (
        <Box maxHeight={['500px', null, null, null, null, null, 'none']} overflowY="auto">
          <Grid
            gridTemplateColumns={['1fr', null, null, null, null, null, 'repeat(4, 1fr)']}
            gridGap="16px"
            p="24px"
            borderBottom="1px solid"
            borderColor="cardBorder"
          >
            <Box>
              <Text as="h6" fontSize="12px" textTransform="uppercase" color="textSubtle" fontWeight="bold" mb="8px">
                {t('Net Winnings')}
              </Text>
              {isLoading ? (
                <Skeleton />
              ) : (
                <NetWinnings
                  amount={result?.netBNB}
                  textPrefix={result?.netBNB > 0 ? '+' : ''}
                  textColor={result?.netBNB > 0 ? 'success' : 'failure'}
                  alignItems="flex-end"
                />
              )}
            </Box>
            <Box>
              <Text as="h6" fontSize="12px" textTransform="uppercase" color="textSubtle" fontWeight="bold" mb="8px">
                {t('Win Rate')}
              </Text>
              {isLoading ? (
                <Skeleton />
              ) : (
                <Text fontWeight="bold">{`${result?.winRate?.toLocaleString(undefined, {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2,
                })}%`}</Text>
              )}
            </Box>
            <Box>
              <Text as="h6" fontSize="12px" textTransform="uppercase" color="textSubtle" fontWeight="bold" mb="8px">
                {t('Rounds Won')}
              </Text>
              {isLoading ? <Skeleton /> : <Text fontWeight="bold">{result?.totalBetsClaimed?.toLocaleString()}</Text>}
            </Box>
            <Box>
              <Text as="h6" fontSize="12px" textTransform="uppercase" color="textSubtle" fontWeight="bold" mb="8px">
                {t('Rounds Played')}
              </Text>
              {isLoading ? <Skeleton /> : <Text fontWeight="bold">{result?.totalBets?.toLocaleString()}</Text>}
            </Box>
          </Grid>
          {isDesktop ? <DesktopBetsTable account={address} /> : <MobileBetsTable account={address} />}
        </Box>
      )}
    </ModalContainer>
  )
}

export default WalletStatsModal
