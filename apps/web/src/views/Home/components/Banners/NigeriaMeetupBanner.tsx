import { useCountdown } from '@pancakeswap/hooks'
import { useTranslation } from '@pancakeswap/localization'
import { Box, Flex, FlexGap, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import { memo, useMemo } from 'react'
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

const NumberDisplayContainer = styled(FlexGap)`
  border-radius: 1.5rem;
  background: #190b36;
  border: 2px solid #ffffff;
  padding: 0 0.625rem;
  width: 6rem;
  height: 8.3rem;
`
const CountDownWrapper = styled.div`
  display: flex;
  background-color: white;
  font-family: Kanit;
  font-size: 18px;
  font-style: normal;
  font-weight: 600;
  line-height: 90%;
  color: #08060b;
  padding: 8px;
  border-radius: 8px;
  margin-top: 5px;
  gap: 0px;
  flex-direction: column;
  width: max-content;
  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
    gap: 8px;
    font-size: 20px;
    line-height: 110%; /* 22px */
  }
`

type NumberDisplayProps = {
  label: string
  value?: number
}

export function NumberDisplay({ label, value }: NumberDisplayProps) {
  const valueDisplay = useMemo(() => (value === undefined ? '-' : String(value).padStart(2, '0')), [value])

  return (
    <NumberDisplayContainer flexDirection="column" alignItems="center" justifyContent="center" gap="0.5rem" flex={1}>
      <Text fontSize="4rem" lineHeight="100%" fontFamily="Inter, Sans-Serif" color="white">
        {valueDisplay}
      </Text>
      <Text textTransform="uppercase" fontSize="0.825rem" color="white">
        {label}
      </Text>
    </NumberDisplayContainer>
  )
}

export function Countdown() {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()
  const countdown = useCountdown(1728723600)
  if (!countdown) {
    return null
  }
  const hours = countdown?.hours < 10 ? `0${countdown?.hours}` : countdown?.hours
  const minutes = countdown?.minutes < 10 ? `0${countdown?.minutes}` : countdown?.minutes
  const days = countdown?.days < 10 ? `0${countdown?.days}` : countdown?.days
  return (
    <CountDownWrapper>
      <Box style={{ fontSize: isMobile ? '12px' : '20px' }}>{t('Starts in')}</Box>
      <Box>
        {days}
        {t('d')} : {hours}
        {t('h')} : {minutes}
        {t('m')}
      </Box>
    </CountDownWrapper>
  )
}

const VerticalDivider = styled.span`
  background: #999999;
  width: 1.5px;
  height: 1.5rem;
  margin: 2px;
`

type ActionsType = { href: string; text: string; icon?: 'arrowForward' | 'openNew' }
type IActions = ActionsType & Partial<CSSStyleDeclaration>

export const NigeriaMeetupBanner = memo(function NigeriaMeetupBanner() {
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
    <BannerContainer background="radial-gradient(94.59% 117.72% at 26.47% 0%, #B1F5CE 0%, #50936B 46.5%, #125429 79.02%)">
      <BannerMain
        badges={
          <Flex alignItems="center" height="20px" style={{ gap: '4px' }} minWidth="220px">
            <PancakeSwapBadge />
            <VerticalDivider />
            <BannerTitle variant="gold" fontSize={18} strokeSize={1}>
              {t('Nigeria')}
            </BannerTitle>
          </Flex>
        }
        title={
          <BannerTitle variant="white" marginTop={isMd ? '-10px' : '0px'}>
            {t('PancakeSwap Meetup')}
          </BannerTitle>
        }
        desc={<Countdown />}
        actions={
          <BannerActionContainer>
            <Action
              href="https://lu.ma/n2v007vd"
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
          src={`${ASSET_CDN}/web/banners/nigeria-meet-up/nigeria-meetup-bunny.png`}
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
            src={`${ASSET_CDN}/web/banners/nigeria-meet-up/floating-cake.png`}
            width={isMobile ? 70 : isTablet ? 86 : 104}
            height={isMobile ? 68 : isTablet ? 84 : 101}
          />
        </Box>
      </BannerGraphics>
    </BannerContainer>
  )
})
