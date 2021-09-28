import React from 'react'
import { Card, CardBody, Heading, PrizeIcon } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import IconStatBox from 'views/Teams/components/IconStatBox'
import { Achievement } from 'state/types'
import AchievementsList from './AchievementsList'
import ClaimPointsCallout from './ClaimPointsCallout '

const Achievements: React.FC<{ achievements: Achievement[]; points?: number }> = ({ achievements, points = 0 }) => {
  const { t } = useTranslation()

  return (
    <Card>
      <CardBody>
        <IconStatBox icon={PrizeIcon} title={points} subtitle={t('Points')} mb="24px" />
        <Heading as="h4" scale="md" mb="16px">
          {t('Achievements')}
        </Heading>
        <ClaimPointsCallout />
        <AchievementsList achievements={achievements} />
      </CardBody>
    </Card>
  )
}

export default Achievements
