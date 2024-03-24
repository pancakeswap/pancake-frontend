import { useTranslation } from '@pancakeswap/localization'
import { Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import {
  BackgroundGraphic,
  BannerActionContainer,
  BannerContainer,
  BannerGraphics,
  BannerMain,
  ButtonLinkAction,
  GraphicDetail,
} from '@pancakeswap/widgets-internal'
import { ASSET_CDN } from 'config/constants/endpoints'
import useTheme from 'hooks/useTheme'
import styled from 'styled-components'
import bCakeMigrationImage from 'views/Farms/images/bCakeMigration.png'

const bgMobile = `${ASSET_CDN}/web/banners/v4-info/bg-mobile.png`

const bgSmVariant: GraphicDetail = {
  src: bgMobile,
  width: 272,
  height: 224,
}

const bgXsVariant: GraphicDetail = {
  src: bgMobile,
  width: 218,
  height: 182,
}

const StyledButtonLinkAction = styled(ButtonLinkAction)`
  height: 33px;
  border-radius: 12px;
  background-color: ${({ theme }) => theme.colors.secondary};

  ${({ theme }) => theme.mediaQueries.sm} {
    height: 48px;
    border-radius: 16px;
  }
`

const migrationLink = '/migration/bcake'
const learnMoreLink =
  'https://developer.pancakeswap.finance/?utm_source=homepagebanner&utm_medium=banner&utm_campaign=homepagebanner&utm_id=Startbuilding'

export const BCakeMigrationBanner = () => {
  const { t } = useTranslation()
  const { isMobile, isTablet } = useMatchBreakpoints()
  const { theme } = useTheme()
  const readWhitepaperAction = (
    <StyledButtonLinkAction
      style={{ background: theme.colors.primary }}
      color="white"
      href={migrationLink}
      padding={['8px 12px']}
    >
      {t('Proceed')}
    </StyledButtonLinkAction>
  )

  const learnMoreAction = (
    <StyledButtonLinkAction
      fontSize={['14px']}
      style={{ background: theme.colors.tertiary }}
      color={theme.colors.primary}
      href={learnMoreLink}
      endIcon={null}
      padding={['8px 12px']}
    >
      {t('Guide')}
    </StyledButtonLinkAction>
  )

  return (
    <BannerContainer background="linear-gradient(261deg, rgba(158, 63, 253, 0.12) 27.61%, rgba(98, 61, 255, 0.25) 76.11%), linear-gradient(247deg, #53DEE9 -16.43%, #A881FC 92.15%)">
      <BannerMain
        title={
          <Text fontWeight={600} fontSize={32} color="white">
            {t('Migrate for new bCAKE')}
          </Text>
        }
        desc={
          <Text color="white" fontSize={['14px', null, '18px']}>
            {t(
              'Migrate your V2, StableSwap or Position Manager staking to continue earning and boost your earning with veCAKE!',
            )}
          </Text>
        }
        actions={
          <BannerActionContainer>
            {readWhitepaperAction}
            {learnMoreAction}
          </BannerActionContainer>
        }
      />
      <BannerGraphics>
        <BackgroundGraphic src={bCakeMigrationImage.src} width={468} height={224} sm={bgSmVariant} xs={bgXsVariant} />
      </BannerGraphics>
    </BannerContainer>
  )
}
