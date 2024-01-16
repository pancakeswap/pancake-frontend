import { useTranslation } from '@pancakeswap/localization'
import { Token } from '@pancakeswap/sdk'
import {
  Box,
  BunnyPlaceholderIcon,
  Card,
  CardBody,
  CardRibbon,
  Flex,
  LaurelLeftIcon,
  LaurelRightIcon,
  Link,
  ProfileAvatar,
  SubMenu,
  SubMenuItem,
  Text,
  useModal,
} from '@pancakeswap/uikit'
import truncateHash from '@pancakeswap/utils/truncateHash'
import { useDomainNameForAddress } from 'hooks/useDomain'
import { useStatModalProps } from 'state/predictions/hooks'
import { useProfileForAddress } from 'state/profile/hooks'
import { PredictionUser } from 'state/types'
import { styled } from 'styled-components'
import { getBlockExploreLink } from 'utils'
import WalletStatsModal from '../WalletStatsModal'
import { NetWinningsRow, Row } from './styles'

interface RankingCardProps {
  rank: 1 | 2 | 3
  user: PredictionUser
  token: Token | undefined
  api: string
}

const RotatedLaurelLeftIcon = styled(LaurelLeftIcon)`
  transform: rotate(30deg);
`

const RotatedLaurelRightIcon = styled(LaurelRightIcon)`
  transform: rotate(-30deg);
`

const getRankingColor = (rank: number) => {
  if (rank === 3) {
    return 'bronze'
  }

  if (rank === 2) {
    return 'silver'
  }

  return 'gold'
}

const RankingCard: React.FC<React.PropsWithChildren<RankingCardProps>> = ({ rank, user, token, api }) => {
  const { t } = useTranslation()
  const rankColor = getRankingColor(rank)
  const { profile, isLoading: isProfileLoading } = useProfileForAddress(user.id)
  const { domainName, avatar } = useDomainNameForAddress(user.id, !profile && !isProfileLoading)
  const { result, address, leaderboardLoadingState } = useStatModalProps({
    account: user.id,
    api,
    tokenSymbol: token?.symbol ?? '',
  })

  const [onPresentWalletStatsModal] = useModal(
    <WalletStatsModal
      api={api}
      token={token}
      result={result}
      address={address}
      leaderboardLoadingState={leaderboardLoadingState}
    />,
    true,
    false,
    'RankingCardWalletStatsModal',
  )

  return (
    <Card ribbon={<CardRibbon variantColor={rankColor} text={`#${rank}`} ribbonPosition="left" />}>
      <CardBody p="24px">
        <Flex alignItems="center" justifyContent="center" flexDirection="column" mb="24px">
          <SubMenu
            component={
              <>
                <Flex mb="4px">
                  <RotatedLaurelLeftIcon color={rankColor} width="32px" />
                  <Box width={['40px', null, null, '64px']} height={['40px', null, null, '64px']}>
                    {profile?.nft?.image?.thumbnail ?? avatar ? (
                      <ProfileAvatar src={profile?.nft?.image?.thumbnail ?? avatar} height={64} width={64} />
                    ) : (
                      <BunnyPlaceholderIcon height={64} width={64} />
                    )}
                  </Box>
                  <RotatedLaurelRightIcon color={rankColor} width="32px" />
                </Flex>
                <Text color="primary" fontWeight="bold" textAlign="center">
                  {profile?.username || domainName || truncateHash(user.id)}
                </Text>
              </>
            }
            options={{ placement: 'bottom' }}
          >
            <SubMenuItem onClick={onPresentWalletStatsModal}>{t('View Stats')}</SubMenuItem>
            <SubMenuItem
              as={Link}
              href={getBlockExploreLink(user.id, 'address', token?.chainId)}
              bold={false}
              color="text"
              external
            >
              {t('View on %site%', { site: t('Explorer') })}
            </SubMenuItem>
          </SubMenu>
        </Flex>
        <Row mb="4px">
          <Text fontSize="12px" color="textSubtle">
            {t('Win Rate')}
          </Text>
          <Text fontWeight="bold">
            {`${user.winRate.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}%`}
          </Text>
        </Row>
        <NetWinningsRow amount={user.netBNB} token={token} />
        <Row>
          <Text fontSize="12px" color="textSubtle">
            {t('Rounds Won')}
          </Text>
          <Text fontWeight="bold">{`${user.totalBetsClaimed}/${user.totalBets.toLocaleString()}`}</Text>
        </Row>
      </CardBody>
    </Card>
  )
}

export default RankingCard
