import { useTranslation } from '@pancakeswap/localization'
import { Button, Flex, Link, OpenNewIcon, Text, useIsomorphicEffect, useMatchBreakpoints } from '@pancakeswap/uikit'
import useTheme from 'hooks/useTheme'
import { ASSET_CDN } from 'config/constants/endpoints'
import React, { memo, useCallback, useRef } from 'react'
import { css, styled } from 'styled-components'
import { useDrawCanvas } from '../../hooks/useDrawCanvas'
import { useDrawSequenceImages } from '../../hooks/useDrawSequence'
import { checkIsIOS } from '../../hooks/useIsIOS'
import { useObserverOnce } from '../../hooks/useObserver'

import {
  CakePartnerTag,
  CakeSectionTag,
  EcoSystemTagOuterWrapper,
  FeatureTagsWrapper,
  PartnerTagOuterWrapper,
  PartnerTagsWrapper,
  useEcosystemTagData,
  usePartnerData,
} from './CakeSectionTag'

const LINE_TRANSITION_TIMES = 0.35
const COVER_TRANSITION_TIMES = 0.45

const borderBoxAnimation = css`
  &:before {
    content: '';
    pointer-events: none;
    position: absolute;
    z-index: 2;
    top: -2px;
    left: 0;
    width: 60%;
    height: 110%;
    transition: transform ${COVER_TRANSITION_TIMES}s ease-in-out ${LINE_TRANSITION_TIMES}s;
    background: ${({ theme }) =>
      theme.isDark
        ? 'linear-gradient(90deg, #08060B 85%, rgba(8, 6, 11, 0.00) 100%)'
        : 'linear-gradient(90deg, #faf9fa 85%, rgba(250, 249, 250, 0) 100%)'};
    ${({ theme }) => theme.mediaQueries.lg} {
      top: 0;
      right: auto;
      left: 0;
      width: 100%;
      height: 70%;
      background: ${({ theme }) =>
        theme.isDark
          ? 'linear-gradient(180deg, #08060B 85%, rgba(8, 6, 11, 0.00) 100%)'
          : 'linear-gradient(180deg, #faf9fa 85%, rgba(250, 249, 250, 0) 100%)'};
    }
  }
  &:after {
    content: '';
    position: absolute;
    pointer-events: none;
    z-index: 2;
    top: -2px;
    right: 0;
    width: 60%;
    height: 110%;
    background: ${({ theme }) =>
      theme.isDark
        ? 'linear-gradient(90deg, rgba(8, 6, 11, 0.00) 0%, #08060B 15%)'
        : 'linear-gradient(90deg, rgba(250, 249, 250, 0.00) 0%, #FAF9FA 15%)'};
    transition: transform ${COVER_TRANSITION_TIMES}s ease-in-out ${LINE_TRANSITION_TIMES}s;
    ${({ theme }) => theme.mediaQueries.lg} {
      width: 100%;
      height: 70%;
      top: auto;
      left: 0;
      bottom: 0;
      background: ${({ theme }) =>
        theme.isDark
          ? 'linear-gradient(180deg, rgba(8, 6, 11, 0.00) 0%, #08060B 15%)'
          : 'linear-gradient(180deg, rgba(250, 249, 250, 0.00) 0%, #FAF9FA 15%)'};
    }
  }
  &.show {
    &:before {
      transform: translateX(-95%);
      ${({ theme }) => theme.mediaQueries.lg} {
        transform: translateY(-87%);
      }
    }
    &:after {
      transform: translateX(95%);
      ${({ theme }) => theme.mediaQueries.lg} {
        transform: translateY(85%);
      }
    }
  }
`

export const CakeSectionMainBox = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  margin-bottom: 40px;
  margin-top: -100px;
  width: 100%;
  padding-left: 8px;
  ${({ theme }) => theme.mediaQueries.lg} {
    margin-top: 50px;
    flex-direction: row;
    width: 936px;
    height: 500px;
  }
`
export const CakeSectionLeftBox = styled.div`
  position: relative;
  display: flex;
  flex-grow: 1;
  flex-shrink: 0;
  flex-direction: column;
  z-index: 1;
  max-width: 100%;
  padding: 16px 24px;
  ${({ theme }) => theme.mediaQueries.lg} {
    max-width: 33%;
    overflow: visible;
    padding: 24px 36px;
  }
`
export const CakeSectionRightBox = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-grow: 1;
  flex-shrink: 0;
  flex-direction: column;
  justify-content: start;
  max-width: 100%;
  padding: 16px 24px;
  ${({ theme }) => theme.mediaQueries.lg} {
    max-width: 33%;
    padding: 24px 36px;
  }
`

const CakeLeftLine = styled.div`
  position: absolute;
  z-index: 2;
  height: 128px;
  width: 1px;
  left: 50%;
  top: 275px;
  background: ${({ theme }) => theme.colors.secondary};
  transition: transform ${LINE_TRANSITION_TIMES}s ease-in-out;
  transform: scaleY(0);
  transform-origin: top center;
  z-index: 4;
  &:before {
    content: '';
    bottom: 0;
    left: -2px;
    position: absolute;
    background: ${({ theme }) => theme.colors.secondary};
    width: 5px;
    height: 5px;
    border-radius: 3px;
  }
  ${({ theme }) => theme.mediaQueries.lg} {
    width: 108px;
    height: 1px;
    left: 277px;
    top: 50%;
    transform: scaleX(0);
    transform-origin: right center;
    &:before {
      bottom: auto;
      left: auto;
      right: 0;
      top: -2px;
    }
  }
  &.show {
    transform: scaleY(1);
    ${({ theme }) => theme.mediaQueries.lg} {
      transform: scaleX(1);
    }
  }
`

const CakeRightLine = styled.div`
  position: absolute;
  height: 92px;
  width: 1px;
  left: 50%;
  top: -92px;
  z-index: 2;
  transition: transform ${LINE_TRANSITION_TIMES}s ease-in-out;
  transform-origin: center top;
  transform: scaleY(0);
  background: ${({ theme }) => theme.colors.secondary};
  ${({ theme }) => theme.mediaQueries.lg} {
    width: 108px;
    height: 1px;
    left: -108px;
    top: 50%;
    transform-origin: left center;
    transform: scaleX(0);
  }
`

const CakeRightBorderBox = styled.div`
  position: relative;
  ${borderBoxAnimation}
  &.show ${CakeRightLine} {
    transform: scaleY(1);
    ${({ theme }) => theme.mediaQueries.lg} {
      transform: scaleX(1);
    }
  }
`
const CakeLeftBorderBox = styled.div`
  position: relative;
  z-index: 3;
  margin-top: 118px;
  ${({ theme }) => theme.mediaQueries.lg} {
    padding-right: 20px;
  }
  ${borderBoxAnimation}
  &.show ${CakeLeftLine} {
    transform: scaleY(1);
    ${({ theme }) => theme.mediaQueries.lg} {
      transform: scaleX(1);
    }
  }
`
const CakeLeftBorder = styled.div`
  position: absolute;
  width: 100%;
  height: 1px;
  background: ${({ theme }) => theme.colors.secondary};
  bottom: 0;
  ${({ theme }) => theme.mediaQueries.lg} {
    bottom: auto;
    top: 0px;
    right: 1px;
    height: 100%;
    width: 1px;
  }
`

const CakeRightBorder = styled.div`
  position: absolute;
  width: 100%;
  height: 1px;
  background: ${({ theme }) => theme.colors.secondary};
  top: 0;
  ${({ theme }) => theme.mediaQueries.lg} {
    bottom: 0;
    top: auto;
    left: 0px;
    height: 100%;
    width: 1px;
  }
`

export const CakeSectionCenterBox = styled.div`
  position: relative;
  z-index: 2;
  display: flex;
  margin-top: 20px;
  justify-content: center;
  align-items: center;
  &:before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    width: 600px;
    height: 600px;
    background: ${({ theme }) =>
      theme.isDark
        ? `radial-gradient(50% 50% at 50% 50%, rgba(151, 71, 255, 0.4) 0%, rgba(151, 71, 255, 0) 100%)`
        : `background: radial-gradient(50% 50.00% at 50% 50.00%, #FFF 0%, rgba(255, 255, 255, 0.00) 100%)`};
  }
`

const CakeBox = styled.div`
  position: relative;
  width: 300px;
  height: 300px;
  overflow: hidden;
  ${({ theme }) => theme.mediaQueries.lg} {
    width: 330px;
    height: 360px;
  }
`
const CakeCanvas = styled.canvas`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0.65);
  ${({ theme }) => theme.mediaQueries.lg} {
    transform: translate(-50%, -52%) scale(0.75);
  }
  background-color: transparent;
`

const width = 900
const height = 900

const CakeSection: React.FC = () => {
  const { theme } = useTheme()
  const { t } = useTranslation()
  const ecosystemTagData = useEcosystemTagData()
  const partnerData = usePartnerData()
  const videoRef = useRef<HTMLVideoElement>()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const leftRef = useRef<HTMLDivElement>(null)
  const leftLineRef = useRef<HTMLDivElement>(null)
  const rightRef = useRef<HTMLDivElement>(null)
  const played = useRef<boolean>(false)
  const cakeBoxRef = useRef<HTMLDivElement>(null)
  const internalRef = useRef(0)
  const seqIntervalRef = useRef(0)
  const { isMobile, isTablet } = useMatchBreakpoints()

  useIsomorphicEffect(() => {
    if (checkIsIOS() || isMobile) return
    const video = document.createElement('video')
    video.autoplay = true
    video.playsInline = true
    video.width = width
    video.src = `${ASSET_CDN}/web/landing/cake-alpha.webm`
    video.muted = true
    videoRef.current = video
  }, [isMobile])

  const { drawImage, isVideoPlaying } = useDrawCanvas(videoRef, canvasRef, internalRef, width, height, () => {
    if (isVideoPlaying.current === false) {
      isVideoPlaying.current = true
      internalRef.current = window.requestAnimationFrame(() => {
        drawImage?.()
      })
      triggerCssAnimation()
    }
  })

  useObserverOnce(cakeBoxRef, () => {
    if (checkIsIOS() || isMobile) {
      if (playing.current === false) {
        playing.current = true
        seqIntervalRef.current = window.setInterval(() => {
          drawSequenceImage(900, 900)
        }, 1000 / 32)
      }
      triggerCssAnimation()
    } else videoRef.current?.play()
  })

  const { drawSequenceImage, playing } = useDrawSequenceImages(
    `${ASSET_CDN}/web/landing/cake-token-sequence`,
    checkIsIOS() || isMobile ? 201 : 0,
    canvasRef,
    seqIntervalRef,
    () => clearInterval(seqIntervalRef.current),
  )

  const triggerCssAnimation = useCallback(() => {
    setTimeout(() => {
      if (leftRef.current) leftRef.current?.classList.add('show')
      if (leftLineRef.current) leftLineRef.current?.classList.add('show')
    }, 1000)
    setTimeout(() => {
      if (rightRef.current) rightRef.current?.classList.add('show')
    }, 2000)
    played.current = true
  }, [])

  const triggerAnimation = useCallback(() => {
    if (played.current) {
      if (leftRef.current) leftRef.current?.classList.add('show')
      if (leftLineRef.current) leftLineRef.current?.classList.add('show')
      if (rightRef.current) rightRef.current?.classList.add('show')
    }
  }, [])

  useIsomorphicEffect(() => {
    triggerAnimation()
    return () => {
      cancelAnimationFrame(internalRef.current)
      clearInterval(seqIntervalRef.current)
    }
  }, [drawImage, triggerAnimation])

  return (
    <Flex
      flexDirection="column"
      style={{ gap: 32 }}
      marginLeft={isMobile ? '-16px' : '0px'}
      width={isMobile ? 'calc(100% + 32px)' : '100%'}
      overflow={isMobile ? 'hidden' : 'visible'}
    >
      <Text textAlign="center" padding="0px 16px">
        <Text fontSize={['32px', null, null, '40px']} display="inline" fontWeight={600} lineHeight="110%">
          {t('Unlock the Full Potential of DeFi with')}
        </Text>
        <Text
          fontWeight={600}
          display="inline"
          marginLeft={10}
          color={theme.isDark ? '#A881FC' : theme.colors.secondary}
          fontSize={['32px', null, null, '40px']}
          lineHeight="110%"
        >
          {t('CAKE')}
        </Text>
      </Text>
      <Flex justifyContent="center">
        <Text
          fontSize={['16px', null, null, '20px']}
          fontWeight={600}
          color={theme.isDark ? '#B8ADD2' : '#7A6EAA'}
          textAlign="center"
          lineHeight="110%"
          padding="0px 16px"
        >
          {t(
            'Experience the power of community ownership, global governance, and explore infinite use cases within the PancakeSwap ecosystem',
          )}
        </Text>
      </Flex>
      <Flex justifyContent="center" style={{ gap: 14 }}>
        <Link href="https://pancakeswap.finance/swap?outputCurrency=0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82&chainId=56">
          <Button variant="primary">{t('Buy CAKE')}</Button>
        </Link>
        <Link href="https://docs.pancakeswap.finance/governance-and-tokenomics/cake-tokenomics">
          <Button pl="0" endIcon={<OpenNewIcon color="primary" />} variant="text">
            {t('Learn')}
          </Button>
        </Link>
      </Flex>
      <CakeSectionMainBox>
        <CakeLeftLine ref={leftLineRef} className={played?.current ? 'show' : ''} />
        <CakeSectionLeftBox>
          <CakeLeftBorderBox ref={leftRef} className={played?.current ? 'show' : ''}>
            <CakeLeftBorder />
            <Text textAlign="center" fontSize="40px" fontWeight="600" mb="20px">
              {t('Ecosystem')}
            </Text>
            <EcoSystemTagOuterWrapper>
              <FeatureTagsWrapper direction={isMobile || isTablet ? 'right' : 'up'}>
                {ecosystemTagData.map((item) => (
                  <CakeSectionTag key={item.text} icon={item.icon} text={item.text} />
                ))}
              </FeatureTagsWrapper>
            </EcoSystemTagOuterWrapper>
          </CakeLeftBorderBox>
        </CakeSectionLeftBox>
        <CakeSectionCenterBox>
          <CakeBox ref={cakeBoxRef}>
            <CakeCanvas width={width} height={height} ref={canvasRef} />
          </CakeBox>
        </CakeSectionCenterBox>
        <CakeSectionRightBox>
          <CakeRightBorderBox ref={rightRef} className={played?.current ? 'show' : ''}>
            <CakeRightBorder />
            <CakeRightLine />
            <Text textAlign="center" fontSize="40px" fontWeight="600" mb="20px">
              {t('Partners')}
            </Text>
            <PartnerTagOuterWrapper>
              <PartnerTagsWrapper direction={isMobile || isTablet ? 'right' : 'up'}>
                {partnerData.map((d) => (
                  <CakePartnerTag icon={d.icon} width={d.width} text={d.text} />
                ))}
              </PartnerTagsWrapper>
            </PartnerTagOuterWrapper>
          </CakeRightBorderBox>
        </CakeSectionRightBox>
      </CakeSectionMainBox>
    </Flex>
  )
}

export default memo(CakeSection)
