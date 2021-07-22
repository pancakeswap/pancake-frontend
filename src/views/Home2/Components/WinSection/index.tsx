import React from 'react'
import styled from 'styled-components'
import { Flex, Text, Box, ChartIcon } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import PurpleWordHeading from '../PurpleWordHeading'
import IconCard, { IconCardData } from '../IconCard'
import PredictionCardContent from './PredictionCardContent'
import LotteryCardContent from './LotteryCardContent'

const TransparentFrame = styled.div`
  background: rgba(255, 255, 255, 0.6);
  padding: 40px;
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  box-sizing: border-box;
  backdrop-filter: blur(12px);
  border-radius: 72px;
`

const WinSection = () => {
  const { t } = useTranslation()

  const PredictionCardData: IconCardData = {
    icon: <ChartIcon width="36px" />,
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

  return (
    <TransparentFrame>
      <Flex flexDirection="column" alignItems="center" justifyContent="center">
        <PurpleWordHeading text={t('Win millions in prizes')} />
        <Text color="textSubtle">{t('Provably fair, on-chain games.')}</Text>
        <Text mb="40px" color="textSubtle">
          {t(' Win big with PancakeSwap.')}
        </Text>
        <Flex m="0 auto" maxWidth="600px">
          <IconCard {...PredictionCardData}>
            <PredictionCardContent />
          </IconCard>
          <Box mr="24px" />
          <IconCard {...LotteryCardData}>
            <LotteryCardContent />
          </IconCard>
        </Flex>
      </Flex>
    </TransparentFrame>
  )
}

export default WinSection
