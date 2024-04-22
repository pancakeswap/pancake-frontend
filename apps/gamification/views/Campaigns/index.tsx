import { useTranslation } from '@pancakeswap/localization'
import { Box } from '@pancakeswap/uikit'
import { Campaigns } from 'views/Campaigns/components/Campaigns'
import { Banner } from 'views/Home/components/Banner'

export const CampaignsView = () => {
  const { t } = useTranslation()

  return (
    <Box>
      <Banner title={t('Explore Campaigns')} subTitle={t('Earn by contributing to the community')} />
      <Campaigns />
    </Box>
  )
}
