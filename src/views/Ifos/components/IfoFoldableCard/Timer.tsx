import React from 'react'
import { useTranslation } from 'contexts/Localization'
import styled from 'styled-components'
import { Flex, Heading, PocketWatchIcon, Text, Skeleton } from '@pancakeswap/uikit'
import getTimePeriods from 'utils/getTimePeriods'
import { PublicIfoData } from 'views/Ifos/types'

interface Props {
  publicIfoData: PublicIfoData
}

const GradientText = styled(Heading)`
  background: -webkit-linear-gradient(#ffd800, #eb8c00);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  -webkit-text-stroke: 1px rgba(0, 0, 0, 0.5);
`

const FlexGap = styled(Flex)<{ gap: string }>`
  gap: ${({ gap }) => gap};
`

const Timer: React.FC<Props> = ({ publicIfoData }) => {
  const { t } = useTranslation()
  const { status, secondsUntilStart, secondsUntilEnd } = publicIfoData
  const countdownToUse = status === 'coming_soon' ? secondsUntilStart : secondsUntilEnd
  const timeUntil = getTimePeriods(countdownToUse)
  return (
    <Flex justifyContent="center" position="relative">
      {status === 'idle' ? (
        <Skeleton animation="pulse" variant="rect" width="100%" height="48px" />
      ) : (
        <>
          <PocketWatchIcon width="42px" mr="8px" />
          <FlexGap gap="8px" alignItems="center">
            <GradientText as="h3" scale="lg" color="textSubtle">
              {`${t('Live Now').toUpperCase()}!`}
            </GradientText>
            <Heading as="h3" scale="lg" color="white">
              {t('Ends in')}
            </Heading>
            <FlexGap gap="4px" alignItems="baseline">
              {timeUntil.days && (
                <>
                  <GradientText scale="lg">{timeUntil.days}</GradientText>
                  <Text color="white">d</Text>
                </>
              )}
              {timeUntil.hours && (
                <>
                  <GradientText scale="lg">{timeUntil.hours}</GradientText>
                  <Text color="white">h</Text>
                </>
              )}
              {timeUntil.minutes && (
                <>
                  <GradientText scale="lg">{timeUntil.minutes}</GradientText>
                  <Text color="white">m</Text>
                </>
              )}
            </FlexGap>
          </FlexGap>
        </>
      )}
    </Flex>
  )
}

export default Timer
