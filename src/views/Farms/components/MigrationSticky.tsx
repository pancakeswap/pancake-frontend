import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { NextLinkFromReactRouter } from 'components/NextLink'
import { Text, Button, useMatchBreakpoints } from '@pancakeswap/uikit'
import {
  MENU_HEIGHT,
  MOBILE_MENU_HEIGHT,
  TOP_BANNER_HEIGHT,
  TOP_BANNER_HEIGHT_MOBILE,
} from '@pancakeswap/uikit/src/widgets/Menu/config'

const Container = styled.div`
  position: sticky;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin: auto;
  padding: 16px;
  z-index: 21;
  transition: top 0.2s;
  border-bottom: 1px ${({ theme }) => theme.colors.secondary} solid;
  border-left: 1px ${({ theme }) => theme.colors.secondary} solid;
  border-right: 1px ${({ theme }) => theme.colors.secondary} solid;
  border-radius: ${({ theme }) => `0 0 ${theme.radii.card} ${theme.radii.card}`};
  background: ${({ theme }) =>
    theme.isDark
      ? 'linear-gradient(360deg, rgba(49, 61, 92, 0.9) 0%, rgba(61, 42, 84, 0.9) 100%)'
      : 'linear-gradient(180deg, rgba(202, 194, 236, 0.9) 0%,  rgba(204, 220, 239, 0.9) 51.04%, rgba(206, 236, 243, 0.9) 100%)'};
  ${({ theme }) => theme.mediaQueries.xxl} {
    width: 1120px;
    padding: 24px 40px;
  }
  ${({ theme }) => theme.mediaQueries.xl} {
    flex-direction: row;
  }
`

const TextGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 14px;
  ${({ theme }) => theme.mediaQueries.xxl} {
    margin-bottom: 0;
  }
`

const TextTitle = styled(Text)`
  font-size: 16px;
  ${({ theme }) => theme.mediaQueries.sm} {
    font-size: 20px;
  }
  ${({ theme }) => theme.mediaQueries.lg} {
    font-size: 40px;
  }
`

const TextSubTitle = styled(Text)`
  font-size: 12px;
  ${({ theme }) => theme.mediaQueries.lg} {
    font-size: 16px;
  }
`

const MigrationSticky: React.FC = () => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()
  const [stickPosition, setStickyPosition] = useState<number>(0)
  const refPrevOffset = useRef(typeof window === 'undefined' ? 0 : window.pageYOffset)

  useEffect(() => {
    const scrollEffect = () => {
      const currentScroll = window.pageYOffset
      if (currentScroll <= 0) {
        setStickyPosition(0)
        return
      }
      if (currentScroll >= refPrevOffset.current) {
        setStickyPosition(0)
      } else {
        const warningBannerHeight = document.querySelector('.warning-banner')
        const topBannerHeight = isMobile ? TOP_BANNER_HEIGHT_MOBILE : TOP_BANNER_HEIGHT
        const topNavHeight = isMobile ? MENU_HEIGHT : MOBILE_MENU_HEIGHT
        const totalTopMenuHeight = warningBannerHeight ? topNavHeight + topBannerHeight : topNavHeight
        setStickyPosition(totalTopMenuHeight)
      }
      refPrevOffset.current = currentScroll
    }

    window.addEventListener('scroll', scrollEffect)
    return () => window.removeEventListener('scroll', scrollEffect)
  }, [isMobile])

  return (
    <Container style={{ top: `${stickPosition}px` }}>
      <TextGroup>
        <TextTitle bold>{t('MasterChef v2 Migration')}</TextTitle>
        <TextSubTitle>{t('Migrate to continue earning staking rewards.')}</TextSubTitle>
      </TextGroup>
      <NextLinkFromReactRouter to="/migration">
        <Button minWidth={isMobile ? '131px' : '178px'}>{t('Proceed')}</Button>
      </NextLinkFromReactRouter>
    </Container>
  )
}

export default MigrationSticky
