import { useTranslation } from '@pancakeswap/localization'
import { Box, Flex, useMatchBreakpoints } from '@pancakeswap/uikit'
import styled from 'styled-components'

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

const VerticalDivider = styled.span`
  background: #999999;
  width: 1.5px;
  height: 1.5rem;
  margin: 2px;
`

type ActionsType = { href: string; text: string; icon?: 'arrowForward' | 'openNew' }
type IActions = ActionsType & Partial<CSSStyleDeclaration>

export const TurkeyMeetupBanner: React.FC = () => {
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
    <BannerContainer background="radial-gradient(91.98% 80.9% at 26.47% 0%, #F4D2D4 0%, #C23D46 30.4%, #71151A 79.36%)">
      <BannerMain
        badges={
          <Flex alignItems="center" height="20px" style={{ gap: '4px' }} minWidth="220px">
            <PancakeSwapBadge />
            <VerticalDivider />
            <BannerTitle variant="gold" fontSize={18} strokeSize={1}>
              {t('Turkey')}
            </BannerTitle>
          </Flex>
        }
        title={
          <BannerTitle variant="white" marginTop={isMd ? '-10px' : '0px'}>
            {t('PancakeSwap Meetup')}
          </BannerTitle>
        }
        desc={<Countdown startTime={1729263600} />}
        actions={
          <BannerActionContainer>
            <Action
              href="https://lu.ma/c3a9ehmj"
              display="flex"
              icon="openNew"
              alignItems="center"
              text={t('Learn More')}
              color="white"
            />
          </BannerActionContainer>
        }
      />

      <BannerGraphics>
        <BackgroundGraphic
          src={`${ASSET_CDN}/web/banners/turkey-meetup/turkey-meetup-bunny.png`}
          width={isMobile ? 185 : isTablet ? 265 : 360}
          height={isMobile ? 120 : isTablet ? 170 : 227}
        />
        <Box
          position="absolute"
          width="100%"
          left={isMobile ? '5%' : isTablet ? '-8%' : '-5%'}
          top={isMobile ? '15%' : isTablet ? '10%' : null}
        >
          <FloatingGraphic
            src={`${ASSET_CDN}/web/banners/floating-cake.png`}
            width={isMobile ? 70 : isTablet ? 86 : 104}
            height={isMobile ? 68 : isTablet ? 84 : 101}
          />
        </Box>
      </BannerGraphics>
    </BannerContainer>
  )
}
