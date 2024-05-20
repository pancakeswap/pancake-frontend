import { useTranslation } from '@pancakeswap/localization'
import { useState } from 'react'
import { Records } from 'views/DashboardCampaigns/components/Records'
import { RecordTemplate, StateType } from 'views/DashboardQuests/components/RecordTemplate'

export const DashboardCampaigns = () => {
  const { t } = useTranslation()
  const [statusButtonIndex, setStatusButtonIndex] = useState(StateType.ON_GOING)

  return (
    <RecordTemplate
      title={t('Campaigns')}
      createLink="/dashboard/campaign/edit"
      createButtonText={t('Create')}
      statusButtonIndex={statusButtonIndex}
      setStatusButtonIndex={setStatusButtonIndex}
    >
      <Records statusButtonIndex={statusButtonIndex} />
    </RecordTemplate>
  )
}
