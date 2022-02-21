import {
  Box,
  Card,
  CardBody,
  CardRibbon,
  Flex,
  ProfileAvatar,
  LaurelLeftIcon,
  LaurelRightIcon,
  Link,
  Text,
  SubMenu,
  SubMenuItem,
  useModal,
} from '@pancakeswap/uikit'
import { PredictionUser } from 'state/types'
import { useGetProfileAvatar } from 'state/profile/hooks'
import styled from 'styled-components'
import { getBscScanLink } from 'utils'
import truncateHash from 'utils/truncateHash'
import { useTranslation } from 'contexts/Localization'
import WalletStatsModal from '../WalletStatsModal'
import { NetWinningsRow, Row } from './styles'

interface RankingCardProps {
  rank: 1 | 2 | 3
  user: PredictionUser
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

const RankingCard: React.FC<RankingCardProps> = ({ rank, user }) => {
  const { t } = useTranslation()
  const rankColor = getRankingColor(rank)
  const profileAvatar = useGetProfileAvatar(user.id)
  const [onPresentWalletStatsModal] = useModal(<WalletStatsModal account={user.id} />)

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
                    <ProfileAvatar src={profileAvatar.nft?.image?.thumbnail} height={64} width={64} />
                  </Box>
                  <RotatedLaurelRightIcon color={rankColor} width="32px" />
                </Flex>
                <Text color="primary" fontWeight="bold" textAlign="center">
                  {profileAvatar.username || truncateHash(user.id)}
                </Text>
              </>
            }
            options={{ placement: 'bottom' }}
          >
            <SubMenuItem onClick={onPresentWalletStatsModal}>{t('View Stats')}</SubMenuItem>
            <SubMenuItem as={Link} href={getBscScanLink(user.id, 'address')} bold={false} color="text" external>
              {t('View on BscScan')}
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
        <NetWinningsRow amount={user.netBNB} />
        <Row>
          <Text fontSize="12px" color="textSubtle">
            {t('Rounds Won')}
          </Text>
          <Text fontWeight="bold">{`${user.totalBetsClaimed.toLocaleString()}/${user.totalBets.toLocaleString()}`}</Text>
        </Row>
      </CardBody>
    </Card>
  )
}

export default RankingCard
