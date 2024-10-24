import { Token } from '@pancakeswap/sdk'
import {
  Box,
  CloseIcon,
  Flex,
  Grid,
  Heading,
  IconButton,
  InjectedModalProps,
  ModalHeader,
  ModalWrapper,
  ProfileAvatar,
  ScanLink,
  Skeleton,
  Text,
  useMatchBreakpoints,
} from '@pancakeswap/uikit'
import truncateHash from '@pancakeswap/utils/truncateHash'
import useTheme from 'hooks/useTheme'
import { useProfileForAddress } from 'state/profile/hooks'
import { styled } from 'styled-components'
import { getBlockExploreLink } from 'utils'

import { useTranslation } from '@pancakeswap/localization'
import { FetchStatus, TFetchStatus } from 'config/constants/types'
import { useDomainNameForAddress } from 'hooks/useDomain'
import { PredictionUser } from 'state/types'
import MobileBetsTable from './MobileBetsTable'
import DesktopBetsTable from './Results/DesktopBetsTable'
import { NetWinningsView } from './Results/styles'

interface WalletStatsModalProps extends InjectedModalProps {
  account?: string
  onBeforeDismiss?: () => void
  address: string
  result: PredictionUser
  leaderboardLoadingState: TFetchStatus
  token: Token | undefined
  api: string
}

const StyledScanLink = styled(ScanLink)`
  color: ${({ theme }) => theme.colors.text};

  svg {
    fill: ${({ theme }) => theme.colors.text};
  }
`

const WalletStatsModal: React.FC<React.PropsWithChildren<WalletStatsModalProps>> = ({
  result,
  address,
  leaderboardLoadingState,
  onDismiss,
  onBeforeDismiss,
  token,
  api,
}) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { profile, isLoading: isProfileLoading } = useProfileForAddress(address)
  const { domainName, avatar } = useDomainNameForAddress(address, !profile && !isProfileLoading)
  const isLoading = leaderboardLoadingState === FetchStatus.Fetching
  const { isDesktop } = useMatchBreakpoints()

  const handleDismiss = () => {
    if (onBeforeDismiss) {
      onBeforeDismiss()
    }

    onDismiss?.()
  }

  return (
    <ModalWrapper minWidth="320px">
      <ModalHeader background={theme.colors.gradientBubblegum}>
        <Flex alignItems="center" style={{ flex: 1 }}>
          <Box width={['64px', null, null, null, null, null, '96px']} mr="16px">
            <ProfileAvatar src={profile?.nft?.image?.thumbnail ?? avatar} height={96} width={96} />
          </Box>
          <Box>
            {profile?.username && (
              <Heading scale="lg" mb="8px">
                {profile?.username}
              </Heading>
            )}
            <StyledScanLink href={getBlockExploreLink(address, 'address', token?.chainId)}>
              {domainName || truncateHash(address)}
            </StyledScanLink>
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
                <NetWinningsView
                  token={token}
                  amount={result?.netToken}
                  textPrefix={result?.netToken > 0 ? '+' : ''}
                  textColor={result?.netToken > 0 ? 'success' : 'failure'}
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
              {isLoading ? <Skeleton /> : <Text fontWeight="bold">{result?.totalBetsClaimed}</Text>}
            </Box>
            <Box>
              <Text as="h6" fontSize="12px" textTransform="uppercase" color="textSubtle" fontWeight="bold" mb="8px">
                {t('Rounds Played')}
              </Text>
              {isLoading ? <Skeleton /> : <Text fontWeight="bold">{result?.totalBets}</Text>}
            </Box>
          </Grid>
          {isDesktop ? (
            <DesktopBetsTable token={token} api={api} account={address} />
          ) : (
            <MobileBetsTable token={token} api={api} account={address} />
          )}
        </Box>
      )}
    </ModalWrapper>
  )
}

export default WalletStatsModal
