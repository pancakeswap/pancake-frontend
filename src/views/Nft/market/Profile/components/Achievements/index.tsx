import React from 'react'
import { Card, CardBody, Heading, PrizeIcon } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import IconStatBox from 'views/Teams/components/IconStatBox'
import AchievementsList from './AchievementsList'
import ClaimPointsCallout from './ClaimPointsCallout '

const Achievements = ({ points = 0 }) => {
  const { t } = useTranslation()

  return (
    <Card>
      <CardBody>
        <IconStatBox icon={PrizeIcon} title={points} subtitle={t('Points')} mb="24px" />
        <Heading as="h4" scale="md" mb="16px">
          {t('Achievements')}
        </Heading>
        <ClaimPointsCallout />
        <AchievementsList />
      </CardBody>
    </Card>
  )
}

export default Achievements
