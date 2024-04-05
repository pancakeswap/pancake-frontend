import { useTranslation } from '@pancakeswap/localization'
import { PM_V2_SS_BOOSTER_SUPPORT_CHAINS } from '@pancakeswap/position-managers'
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
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import useTheme from 'hooks/useTheme'
import styled from 'styled-components'
import bCakeMigrationImage from 'views/Farms/images/bCakeMigration.png'
import bCakeMigrationMobileImage from 'views/Farms/images/bCakeMigrationMobileBg.png'

const bgSmVariant: GraphicDetail = {
  src: bCakeMigrationMobileImage.src,
  width: 272,
  height: 224,
}

const bgXsVariant: GraphicDetail = {
  src: bCakeMigrationMobileImage.src,
  width: 178,
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
const learnMoreLink = 'https://docs.pancakeswap.finance/products/yield-farming/bcake/migration-guide'

export const BCakeMigrationBanner = () => {
  const { chainId } = useActiveWeb3React()
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()
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
  if (!PM_V2_SS_BOOSTER_SUPPORT_CHAINS.includes(chainId ?? 0)) return null
  return (
    <BannerContainer background="linear-gradient(261deg, rgba(158, 63, 253, 0.12) 27.61%, rgba(98, 61, 255, 0.25) 76.11%), linear-gradient(247deg, #53DEE9 -16.43%, #A881FC 92.15%)">
      <BannerMain
        containerStyle={{ marginRight: '-60px', width: '70%' }}
        title={
          <Text fontWeight={600} fontSize={isMobile ? 24 : 32} style={{ lineHeight: '110%' }} color="white">
            {t('Migrate for new bCAKE')}
          </Text>
        }
        desc={
          <Text fontWeight={600} color="white" fontSize={['12px', null, '18px']}>
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
