import { useTranslation } from '@pancakeswap/localization'
import { useMatchBreakpoints } from '@pancakeswap/uikit'
import { Records } from 'views/DashboardCampaigns/components/Records'
import { RecordTemplate } from 'views/DashboardQuests/components/RecordTemplate'

export const DashboardCampaigns = () => {
  const { t } = useTranslation()
  const { isTablet } = useMatchBreakpoints()

  return (
    <RecordTemplate title={t('Campaigns')} createButtonText={isTablet ? t('Create') : t('Create a campaign')}>
      <Records />
    </RecordTemplate>
  )
}
