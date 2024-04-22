import { useTranslation } from '@pancakeswap/localization'
import { Box } from '@pancakeswap/uikit'
import { ASSET_CDN } from 'config/constants/endpoints'
import { Banner } from 'views/Quests/components/Banner'
import { Quests } from 'views/Quests/components/Quests'

export const QuestsView = () => {
  const { t } = useTranslation()

  return (
    <Box>
      <Banner
        title={t('Explore Quests')}
        subTitle={t('Earn by contributing to the community')}
        bannerImageUrl={`${ASSET_CDN}/web/game/developers/game-banner-bunny.png`}
      />
      <Quests />
    </Box>
  )
}
