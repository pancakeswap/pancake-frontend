import {
  Box,
  Card,
  CardBody,
  CardRibbon,
  Flex,
  ProfileAvatar,
  LaurelLeftIcon,
  LaurelRightIcon,
  Text,
  SubMenu,
} from '@pancakeswap/uikit'
import styled from 'styled-components'
import { useTranslation } from '@pancakeswap/localization'

interface RankingCardProps {
  rank: 1 | 2 | 3
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

const RankingCard: React.FC<React.PropsWithChildren<RankingCardProps>> = ({ rank }) => {
  const { t } = useTranslation()
  const rankColor = getRankingColor(rank)
  // const { profile, isLoading: isProfileLoading } = useProfileForAddress(user.id)
  // const { domainName, avatar } = useDomainNameForAddress(user.id, !profile && !isProfileLoading)

  return (
    <Card ribbon={<CardRibbon variantColor={rankColor} text={`#${rank}`} ribbonPosition="left" />}>
      <CardBody p="24px">
        <Flex alignItems="center" justifyContent="center" flexDirection="column" mb="24px">
          <SubMenu
            component={
              <Flex flexDirection="column">
                <Flex mb="4px">
                  <RotatedLaurelLeftIcon color={rankColor} width="32px" />
                  <Box width={['40px', null, null, '64px']} height={['40px', null, null, '64px']}>
                    {/* <ProfileAvatar src={profile?.nft?.image?.thumbnail ?? avatar} height={64} width={64} /> */}
                    <ProfileAvatar
                      src="https://static-nft.pancakeswap.com/mainnet/0xDf7952B35f24aCF7fC0487D01c8d5690a60DBa07/twinkle-1000.png"
                      height={64}
                      width={64}
                    />
                  </Box>
                  <RotatedLaurelRightIcon color={rankColor} width="32px" />
                </Flex>
                <Text color="primary" fontWeight="bold" textAlign="center">
                  1233
                  {/* {profile?.username || domainName || truncateHash(user.id)} */}
                </Text>
              </Flex>
            }
            options={{ placement: 'bottom' }}
          />
        </Flex>
        <Flex justifyContent="space-between" mb="4px">
          <Text bold color="textSubtle">
            {t('Total reward')}
          </Text>
          <Box>
            <Text textAlign="right" bold color="text" fontSize="20px" lineHeight="110%">
              $2,534.23
            </Text>
            <Text textAlign="right" color="textSubtle" fontSize="12px">
              ~1,456.32 CAKE
            </Text>
          </Box>
        </Flex>
        <Flex justifyContent="space-between">
          <Text bold color="textSubtle">
            {t('Trading volume')}
          </Text>
          <Text textAlign="right" bold color="text" fontSize="20px">
            $2,534.23
          </Text>
        </Flex>
      </CardBody>
    </Card>
  )
}

export default RankingCard
