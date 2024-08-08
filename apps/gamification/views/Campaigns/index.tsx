import { useTranslation } from '@pancakeswap/localization'
import { Box } from '@pancakeswap/uikit'
import { ASSET_CDN } from 'config/constants/endpoints'
import { Campaigns } from 'views/Campaigns/components/Campaigns'
import { Banner } from 'views/Quests/components/Banner'

export const CampaignsView = () => {
  const { t } = useTranslation()

  return (
    <Box pb="200px">
      <Banner
        title={t('Explore Campaigns')}
        subTitle={t('Earn by contributing to the community')}
        bannerImageUrl={`${ASSET_CDN}/web/game/developers/game-banner-bunny.png`}
      />
      <Campaigns />
    </Box>
  )
}
