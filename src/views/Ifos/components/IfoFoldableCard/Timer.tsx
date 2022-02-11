import React from 'react'
import { useTranslation } from 'contexts/Localization'
import styled from 'styled-components'
import { Flex, Heading, PocketWatchIcon, Text, Skeleton } from '@tovaswapui/uikit'
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

export const SoonTimer: React.FC<Props> = ({ publicIfoData }) => {
  const { t } = useTranslation()
  const { status, secondsUntilStart } = publicIfoData
  const timeUntil = getTimePeriods(secondsUntilStart)
  return (
    <Flex justifyContent="center" position="relative">
      {status === 'idle' ? (
        <Skeleton animation="pulse" variant="rect" width="100%" height="48px" />
      ) : (
        <>
          <FlexGap gap="8px" alignItems="center">
            <Heading as="h3" scale="lg" color="secondary">
              {t('Start in')}
            </Heading>
            <FlexGap gap="4px" alignItems="baseline">
              {timeUntil.days ? (
                <>
                  <Heading scale="lg" color="secondary">
                    {timeUntil.days}
                  </Heading>
                  <Text color="secondary">{t('d')}</Text>
                </>
              ) : null}
              {timeUntil.days || timeUntil.hours ? (
                <>
                  <Heading color="secondary" scale="lg">
                    {timeUntil.hours}
                  </Heading>
                  <Text color="secondary">{t('h')}</Text>
                </>
              ) : null}
              <>
                <Heading color="secondary" scale="lg">
                  {timeUntil.minutes}
                </Heading>
                <Text color="secondary">{t('m')}</Text>
              </>
            </FlexGap>
          </FlexGap>
        </>
      )}
    </Flex>
  )
}

const EndInHeading = styled(Heading)`
  color: white;
  font-size: 20px;
  font-weight: 600;
  line-height: 1.1;

  ${({ theme }) => theme.mediaQueries.md} {
    font-size: 24px;
  }
`

const LiveNowHeading = styled(EndInHeading)`
  color: white;
  ${({ theme }) => theme.mediaQueries.md} {
    background: -webkit-linear-gradient(#ffd800, #eb8c00);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    -webkit-text-stroke: 1px rgba(0, 0, 0, 0.5);
  }
`

const LiveTimer: React.FC<Props> = ({ publicIfoData }) => {
  const { t } = useTranslation()
  const { status, secondsUntilEnd } = publicIfoData
  const timeUntil = getTimePeriods(secondsUntilEnd)
  return (
    <Flex justifyContent="center" position="relative">
      {status === 'idle' ? (
        <Skeleton animation="pulse" variant="rect" width="100%" height="48px" />
      ) : (
        <>
          <PocketWatchIcon width="42px" mr="8px" />
          <FlexGap gap="8px" alignItems="center">
            <LiveNowHeading as="h3">{`${t('Live Now').toUpperCase()}!`}</LiveNowHeading>
            <EndInHeading as="h3" scale="lg" color="white">
              {t('Ends in')}
            </EndInHeading>
            <FlexGap gap="4px" alignItems="baseline">
              {timeUntil.days ? (
                <>
                  <GradientText scale="lg">{timeUntil.days}</GradientText>
                  <Text color="white">{t('d')}</Text>
                </>
              ) : null}
              {timeUntil.days || timeUntil.hours ? (
                <>
                  <GradientText scale="lg">{timeUntil.hours}</GradientText>
                  <Text color="white">{t('h')}</Text>
                </>
              ) : null}
              <>
                <GradientText scale="lg">{timeUntil.minutes}</GradientText>
                <Text color="white">{t('m')}</Text>
              </>
            </FlexGap>
          </FlexGap>
        </>
      )}
    </Flex>
  )
}

export default LiveTimer
