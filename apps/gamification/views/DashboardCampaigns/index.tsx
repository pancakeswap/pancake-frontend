import { useTranslation } from '@pancakeswap/localization'
import { useMatchBreakpoints } from '@pancakeswap/uikit'
import { useState } from 'react'
import { Records } from 'views/DashboardCampaigns/components/Records'
import { RecordTemplate, StateType } from 'views/DashboardQuests/components/RecordTemplate'

export const DashboardCampaigns = () => {
  const { t } = useTranslation()
  const { isTablet } = useMatchBreakpoints()
  const [statusButtonIndex, setStatusButtonIndex] = useState(StateType.ON_GOING)

  return (
    <RecordTemplate
      title={t('Campaigns')}
      createLink="/dashboard/campaign/edit"
      createButtonText={isTablet ? t('Create') : t('Create a campaign')}
      statusButtonIndex={statusButtonIndex}
      setStatusButtonIndex={setStatusButtonIndex}
    >
      <Records statusButtonIndex={statusButtonIndex} />
    </RecordTemplate>
  )
}
