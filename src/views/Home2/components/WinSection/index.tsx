import React from 'react'
import styled from 'styled-components'
import { Flex, Text, Box, ChartIcon } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import useTheme from 'hooks/useTheme'
import PurpleWordHeading from '../PurpleWordHeading'
import IconCard, { IconCardData } from '../IconCard'
import PredictionCardContent from './PredictionCardContent'
import LotteryCardContent from './LotteryCardContent'
import CompositeImage from '../CompositeImage'

const TransparentFrame = styled.div<{ isDark: boolean }>`
  background: ${({ theme }) => (theme.isDark ? 'rgba(8, 6, 11, 0.6)' : ' rgba(255, 255, 255, 0.6)')};
  padding: 40px;
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  box-sizing: border-box;
  backdrop-filter: blur(12px);
  border-radius: 72px;
`

const BgWrapper = styled.div`
  overflow: hidden;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0px;
  left: 0px;
`

const BottomLeftImgWrapper = styled(Flex)`
  position: absolute;
  left: 0;
  bottom: -64px;
`

const TopRightImgWrapper = styled(Flex)`
  position: absolute;
  right: 0;
  top: -64px;
`

const WinSection = () => {
  const { t } = useTranslation()
  const { theme } = useTheme()

  const PredictionCardData: IconCardData = {
    icon: <ChartIcon width="36px" color="inverseContrast" />,
    background: 'linear-gradient(180deg, #ffb237 0%, #ffcd51 51.17%, #ffe76a 100%);',
    borderColor: '#ffb237',
    rotation: '-2.36deg',
  }

  const LotteryCardData: IconCardData = {
    icon: <ChartIcon width="36px" />,
    background: ' linear-gradient(180deg, #7645D9 0%, #5121B1 100%);',
    borderColor: '#3C1786',
    rotation: '1.43deg',
  }

  const bottomLeftImage = {
    path: '/images/home/prediction-cards/',
    attributes: [
      { src: 'bottom-left', alt: 'CAKE card' },
      { src: 'green', alt: 'Green CAKE card with up arrow' },
      { src: 'red', alt: 'Red Cake card with down arrow' },
      { src: 'top-right', alt: 'CAKE card' },
    ],
  }

  const topRightImage = {
    path: '/images/home/lottery-balls/',
    attributes: [
      { src: '2', alt: 'Lottery ball number 2' },
      { src: '4', alt: 'Lottery ball number 4' },
      { src: '6', alt: 'Lottery ball number 6' },
      { src: '7', alt: 'Lottery ball number 7' },
      { src: '9', alt: 'Lottery ball number 9' },
    ],
  }

  return (
    <>
      <BgWrapper>
        <BottomLeftImgWrapper>
          <CompositeImage {...bottomLeftImage} />
        </BottomLeftImgWrapper>
        <TopRightImgWrapper>
          <CompositeImage {...topRightImage} />
        </TopRightImgWrapper>
      </BgWrapper>
      <TransparentFrame isDark={theme.isDark}>
        <Flex flexDirection="column" alignItems="center" justifyContent="center">
          <PurpleWordHeading text={t('Win millions in prizes')} />
          <Text color="textSubtle">{t('Provably fair, on-chain games.')}</Text>
          <Text mb="40px" color="textSubtle">
            {t(' Win big with PancakeSwap.')}
          </Text>
          <Flex m="0 auto" maxWidth="600px">
            <Flex flex="1" mr="24px">
              <IconCard {...PredictionCardData}>
                <PredictionCardContent />
              </IconCard>
            </Flex>
            <Flex flex="1">
              <IconCard {...LotteryCardData}>
                <LotteryCardContent />
              </IconCard>
            </Flex>
          </Flex>
        </Flex>
      </TransparentFrame>
    </>
  )
}

export default WinSection
