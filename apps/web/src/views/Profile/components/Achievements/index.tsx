import { useTranslation } from '@pancakeswap/localization'
import { Card, CardBody, Heading, PrizeIcon } from '@pancakeswap/uikit'
import { Achievement } from 'state/types'
import IconStatBox from 'views/Teams/components/IconStatBox'
import AchievementsList from './AchievementsList'
import ClaimPointsCallout from './ClaimPointsCallout'

const Achievements: React.FC<
  React.PropsWithChildren<{
    achievements: Achievement[]
    isLoading: boolean
    points?: number
    onSuccess?: () => void
  }>
> = ({ achievements, isLoading, points = 0, onSuccess }) => {
  const { t } = useTranslation()

  return (
    <Card>
      <CardBody>
        <IconStatBox icon={PrizeIcon} title={points} subtitle={t('Points')} mb="24px" />
        <Heading as="h4" scale="md" mb="16px">
          {t('Achievements')}
        </Heading>
        <ClaimPointsCallout onSuccess={onSuccess} />
        <AchievementsList achievements={achievements} isLoading={isLoading} />
      </CardBody>
    </Card>
  )
}

export default Achievements
