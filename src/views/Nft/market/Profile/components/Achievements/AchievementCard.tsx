import styled from 'styled-components'
import { Flex, PrizeIcon, Text } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { Achievement } from 'state/types'
import AchievementAvatar from './AchievementAvatar'
import AchievementTitle from './AchievementTitle'
import AchievementDescription from './AchievementDescription'

interface AchievementCardProps {
  achievement: Achievement
}

const Details = styled(Flex)`
  flex: 1;
  flex-direction: column;
  justify-content: center;
  padding-left: 8px;
  padding-right: 8px;
`

const AchievementCard: React.FC<AchievementCardProps> = ({ achievement }) => {
  const {
    currentLanguage: { locale },
  } = useTranslation()

  return (
    <Flex>
      <AchievementAvatar badge={achievement.badge} />
      <Details>
        <AchievementTitle title={achievement.title} />
        <AchievementDescription description={achievement.description} />
      </Details>
      <Flex alignItems="center">
        <PrizeIcon width="18px" color="textSubtle" mr="4px" />
        <Text color="textSubtle">{achievement.points.toLocaleString(locale)}</Text>
      </Flex>
    </Flex>
  )
}

export default AchievementCard
