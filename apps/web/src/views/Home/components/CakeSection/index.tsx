import { useTranslation } from '@pancakeswap/localization'
import { Button, Flex, Link, OpenNewIcon, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import useTheme from 'hooks/useTheme'
import React, { useRef, useLayoutEffect, useCallback } from 'react'
import styled from 'styled-components'

import {
  CakeSectionTag,
  CakePartnerTag,
  useEcosystemTagData,
  usePartnerData,
  FeatureTagsWrapper,
  PartnerTagsWrapper,
  EcoSystemTagOuterWrapper,
  PartnerTagOuterWrapper,
} from './CakeSectionTag'

export const CakeSectionMainBox = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  margin-top: 50px;

  margin-bottom: 40px;
  width: 100%;

  ${({ theme }) => theme.mediaQueries.lg} {
    flex-direction: row;
    width: 936px;
    height: 400px;
  }
`
export const CakeSectionLeftBox = styled.div`
  display: flex;
  flex-grow: 1;
  flex-shrink: 0;
  flex-direction: column;
  max-width: 100%;
  padding: 24px 36px;
  ${({ theme }) => theme.mediaQueries.lg} {
    max-width: 33%;
  }
`
export const CakeSectionRightBox = styled.div`
  display: flex;
  flex-grow: 1;
  flex-shrink: 0;
  flex-direction: column;
  justify-content: start;
  max-width: 100%;
  padding: 24px 36px;
  ${({ theme }) => theme.mediaQueries.lg} {
    max-width: 33%;
  }
`

export const CakeSectionCenterBox = styled.div`
  position: relative;
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
  width: 360px;
  height: 360px;
  overflow: hidden;
`

const CakeVideo = styled.video`
  opacity: 0;
  visibility: hidden;
  position: absolute;
  -webkit-filter: grayscale(100%); /* Safari 6.0 - 9.0 */
  filter: grayscale(100%);
`
const CakeCanvas = styled.canvas`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: transparent;
`

let canvasInterval = 0
const fps = 60
const width = 734
const height = 734

const useDrawCanvas = (
  videoRef: React.MutableRefObject<HTMLVideoElement>,
  canvasRef: React.MutableRefObject<HTMLCanvasElement>,
) => {
  const video = videoRef?.current
  const canvas = canvasRef?.current
  const isElementReady = video && canvas

  const drawImage = useCallback(() => {
    const context = canvas?.getContext('2d', { alpha: true })
    context.clearRect(0, 0, width, height)
    context.drawImage(video, 0, 0, width, height)
  }, [canvas, video])

  if (isElementReady) {
    video.onpause = () => {
      clearInterval(canvasInterval)
    }

    video.onended = () => {
      clearInterval(canvasInterval)
    }
    video.onplay = () => {
      window.setInterval(() => {
        drawImage()
      }, 1000 / fps)
    }
  }

  return { drawImage: isElementReady ? drawImage : null }
}

const CakeSection: React.FC = () => {
  const { theme } = useTheme()
  const { t } = useTranslation()
  const ecosystemTagData = useEcosystemTagData()
  const partnerData = usePartnerData()
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { drawImage } = useDrawCanvas(videoRef, canvasRef)
  const { isMobile } = useMatchBreakpoints()
  useLayoutEffect(() => {
    canvasInterval = window.setInterval(() => {
      drawImage?.()
    }, 1000 / fps)
    return () => clearInterval(canvasInterval)
  }, [drawImage])

  return (
    <Flex
      flexDirection="column"
      style={{ gap: 32 }}
      marginLeft={isMobile ? '-8px' : '0px'}
      width={isMobile ? 'calc(100% + 16px)' : '100%'}
      overflow={isMobile ? 'hidden' : 'visible'}
    >
      <Text textAlign="center">
        <Text fontSize="40px" display="inline" fontWeight={600} lineHeight="110%">
          {t('Unlock the Full Potential of DeFi with')}
        </Text>
        <Text
          fontWeight={600}
          display="inline"
          marginLeft={10}
          color={theme.isDark ? '#A881FC' : theme.colors.secondary}
          fontSize="40px"
          lineHeight="110%"
        >
          {t('CAKE')}
        </Text>
      </Text>
      <Flex justifyContent="center">
        <Text
          fontSize={20}
          fontWeight={600}
          color={theme.isDark ? '#B8ADD2' : '#7A6EAA'}
          textAlign="center"
          lineHeight="110%"
        >
          {t(
            'Experience the power of community ownership, global governance, and explore infinite use cases within the PancakeSwap ecosystem',
          )}
        </Text>
      </Flex>
      <Flex justifyContent="center" style={{ gap: 14 }}>
        <Link href="https://pancakeswap.finance/swap?outputCurrency=0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82&chainId=56">
          <Button variant="primary">{t('Buy Cake')}</Button>
        </Link>
        <Link href="https://docs.pancakeswap.finance/governance-and-tokenomics/cake-tokenomics">
          <Button endIcon={<OpenNewIcon color="primary" />} variant="secondary">
            {t('Discover Cake')}
          </Button>
        </Link>
      </Flex>
      <CakeSectionMainBox>
        <CakeSectionLeftBox>
          <Text textAlign="center" fontSize="40px" fontWeight="600" mb="20px">
            {t('Ecosystem')}
          </Text>
          <EcoSystemTagOuterWrapper>
            <FeatureTagsWrapper direction={isMobile ? 'right' : 'up'}>
              {ecosystemTagData.map((item) => (
                <CakeSectionTag key={item.text} icon={item.icon} text={item.text} />
              ))}
            </FeatureTagsWrapper>
          </EcoSystemTagOuterWrapper>
        </CakeSectionLeftBox>
        <CakeSectionCenterBox>
          <CakeBox>
            <CakeCanvas width={width} height={height} ref={canvasRef} />
            <CakeVideo ref={videoRef} width={width} loop controls autoPlay muted id="video">
              <source src="/assets/cake-alpha.webm" type="video/webm" />
            </CakeVideo>
          </CakeBox>
          {/* <Image src={cakeSectionMain} alt="cakeSectionMain" width={395} height={395} placeholder="blur" /> */}
        </CakeSectionCenterBox>
        <CakeSectionRightBox>
          <Text textAlign="center" fontSize="40px" fontWeight="600" mb="20px">
            {t('Partners')}
          </Text>
          <PartnerTagOuterWrapper>
            <PartnerTagsWrapper direction={isMobile ? 'right' : 'up'} play={isMobile}>
              {partnerData.map((d) => (
                <CakePartnerTag icon={d.icon} width={d.width} />
              ))}
            </PartnerTagsWrapper>
          </PartnerTagOuterWrapper>
        </CakeSectionRightBox>
      </CakeSectionMainBox>
    </Flex>
  )
}

export default CakeSection
