import { useTranslation } from '@pancakeswap/localization'
import { useMatchBreakpoints } from '@pancakeswap/uikit'
import { useState } from 'react'
import { RecordTemplate, StateType } from 'views/DashboardQuests/components/RecordTemplate'
import { Records } from 'views/DashboardQuests/components/Records'

export const DashboardQuests = () => {
  const { t } = useTranslation()
  const { isTablet } = useMatchBreakpoints()
  const [statusButtonIndex, setStatusButtonIndex] = useState(StateType.ON_GOING)

  return (
    <RecordTemplate
      title={t('Guests')}
      createLink="/dashboard/quest/edit"
      createButtonText={isTablet ? t('Create') : t('Create a quest')}
      statusButtonIndex={statusButtonIndex}
      setStatusButtonIndex={setStatusButtonIndex}
    >
      <Records statusButtonIndex={statusButtonIndex} />
    </RecordTemplate>
  )
}
