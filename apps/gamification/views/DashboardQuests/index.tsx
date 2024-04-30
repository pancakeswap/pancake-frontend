import { useTranslation } from '@pancakeswap/localization'
import { useMatchBreakpoints } from '@pancakeswap/uikit'
import { Records } from 'views/DashboardQuests/components/Records'
import { RecordTemplate } from 'views/DashboardQuests/components/RecordTemplate'

export const DashboardQuests = () => {
  const { t } = useTranslation()
  const { isTablet } = useMatchBreakpoints()

  return (
    <RecordTemplate
      title={t('Guests')}
      createButtonText={isTablet ? t('Create') : t('Create a quest')}
      createLink="/dashboard/quest/edit"
    >
      <Records />
    </RecordTemplate>
  )
}
