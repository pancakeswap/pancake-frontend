import { useTranslation } from '@pancakeswap/localization'
import { Box, useMatchBreakpoints } from '@pancakeswap/uikit'
import { memo } from 'react'

import {
  BackgroundGraphic,
  BannerActionContainer,
  BannerContainer,
  BannerGraphics,
  BannerMain,
  BannerTitle,
  FloatingGraphic,
  LinkExternalAction,
  PancakeSwapBadge,
} from '@pancakeswap/widgets-internal'
import { ASSET_CDN } from 'config/constants/endpoints'
import { Countdown } from './Countdown'

type ActionsType = { href: string; text: string; icon?: 'arrowForward' | 'openNew' }
type IActions = ActionsType & Partial<CSSStyleDeclaration>

export const BrasilMeetupBanner = memo(function BrasilMeetupBanner() {
  const { t } = useTranslation()
  const { isMobile, isTablet, isMd } = useMatchBreakpoints()

  const Action = ({ href, icon, text, ...props }: IActions) => (
    <Box display={props.display} marginTop={props.marginTop}>
      <LinkExternalAction href={href} externalIcon={icon} color={props.color}>
        {t(text)}
      </LinkExternalAction>
    </Box>
  )

  return (
    <BannerContainer background="linear-gradient(180deg, #DDCC26 0%, #389C1F 100%)">
      <BannerMain
        badges={<PancakeSwapBadge />}
        title={
          <BannerTitle variant="purple" marginTop={isMd ? '-10px' : '0px'}>
            {t('PancakeSwap Meetup')}
          </BannerTitle>
        }
        desc={<Countdown startTime={1724961600} />}
        actions={
          <BannerActionContainer>
            <Action
              href="https://lu.ma/bdw82pz2"
              display="flex"
              icon="openNew"
              alignItems="center"
              text={t('Learn More')}
              color="#280D5F"
            />
          </BannerActionContainer>
        }
      />

      <BannerGraphics>
        <BackgroundGraphic
          src={`${ASSET_CDN}/web/banners/brasil/brasil-meetup-bunny.png`}
          width={isMobile ? 160 : isTablet ? 225 : 320}
          height={isMobile ? 155 : isTablet ? 210 : 227}
        />
        <Box
          position="absolute"
          width="100%"
          left={isMobile ? '5%' : isTablet ? '-8%' : '-5%'}
          top={isMobile ? '15%' : isTablet ? '10%' : null}
        >
          <FloatingGraphic
            src={`${ASSET_CDN}/web/banners/brasil/coin.png`}
            width={isMobile ? 70 : isTablet ? 86 : 104}
            height={isMobile ? 68 : isTablet ? 84 : 101}
          />
        </Box>
      </BannerGraphics>
    </BannerContainer>
  )
})
