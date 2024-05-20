import { useTranslation } from '@pancakeswap/localization'
import { useState } from 'react'
import { RecordTemplate, StateType } from 'views/DashboardQuests/components/RecordTemplate'
import { Records } from 'views/DashboardQuests/components/Records'

export const DashboardQuests = () => {
  const { t } = useTranslation()
  const [statusButtonIndex, setStatusButtonIndex] = useState(StateType.ON_GOING)

  return (
    <RecordTemplate
      title={t('Guests')}
      createLink="/dashboard/quest/edit"
      createButtonText={t('Create')}
      statusButtonIndex={statusButtonIndex}
      setStatusButtonIndex={setStatusButtonIndex}
    >
      <Records statusButtonIndex={statusButtonIndex} />
    </RecordTemplate>
  )
}
