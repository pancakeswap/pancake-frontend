import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { Flex, Text, useMatchBreakpoints, WarningIcon, Button, Link } from '@pancakeswap/uikit'
import { MENU_HEIGHT, TOP_BANNER_HEIGHT, TOP_BANNER_HEIGHT_MOBILE } from '@pancakeswap/uikit/src/widgets/Menu/config'

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
  overflow: hidden;
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

const BunnyImage = styled.img`
  position: relative;
  width: 210px;
  bottom: -24px;
  margin-left: 10px;

  ${({ theme }) => theme.mediaQueries.sm} {
    bottom: -12px;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    width: 220px;
    right: -30px;
    bottom: -14px;
    margin-left: 40px;
  }
`

const StyledLink = styled(Link)`
  width: 100%;
  margin-top: 8px;
  &:hover {
    text-decoration: initial;
  }
`

const MigrationSticky: React.FC = () => {
  const { t } = useTranslation()
  const { isMobile, isXs, isSm, isMd } = useMatchBreakpoints()
  const [stickPosition, setStickyPosition] = useState(0)
  const refPrevOffset = useRef(typeof window === 'undefined' ? 0 : window.pageYOffset)
  const isSmallScreen = isXs || isSm || isMd

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
        const totalTopMenuHeight = warningBannerHeight ? MENU_HEIGHT + topBannerHeight : MENU_HEIGHT
        setStickyPosition(totalTopMenuHeight)
      }
      refPrevOffset.current = currentScroll
    }

    window.addEventListener('scroll', scrollEffect)
    return () => window.removeEventListener('scroll', scrollEffect)
  }, [isMobile])

  return (
    <Container style={{ top: `${stickPosition}px` }}>
      <Flex flexDirection="column" minWidth="224px">
        <Flex>
          <WarningIcon width={isSmallScreen ? '20px' : '28px'} />
          <Text fontSize={isSmallScreen ? '20px' : '40px'} ml={10} bold>
            {t('Migration in Progress')}
          </Text>
        </Flex>
        <Text fontSize={isSmallScreen ? '14px' : '16px'}>
          {t(
            'PancakeSwap is undergoing MasterChef migration. You might see farms being moved to “Finished” and stop giving out rewards.',
          )}
        </Text>
        <Flex flexDirection={isSmallScreen ? 'column' : 'row'}>
          <StyledLink href="https://twitter.com/pancakeswap" external>
            <Button width="100%" mr={isSmallScreen ? '0px' : '24px'}>
              {t('Follow Twitter for updates')}
            </Button>
          </StyledLink>
          <StyledLink href="https://docs.pancakeswap.finance/code/migration/migrate-your-stakings" external>
            <Button width="100%">{t('Learn More')}</Button>
          </StyledLink>
        </Flex>
      </Flex>
      <BunnyImage src="/images/bunnies-migration.svg" alt="bunny migration" />
    </Container>
  )
}

export default MigrationSticky
