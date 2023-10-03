import { useTranslation } from '@pancakeswap/localization'
import { styled } from 'styled-components'
import { Flex, Heading, PocketWatchIcon, Text, Skeleton, TimerIcon, useTooltip } from '@pancakeswap/uikit'
import getTimePeriods from '@pancakeswap/utils/getTimePeriods'
import { PublicIfoData } from 'views/Ifos/types'
import { getStatus } from 'views/Ifos/hooks/helpers'
import useLedgerTimestamp from 'hooks/useLedgerTimestamp'

interface Props {
  publicIfoData: PublicIfoData
}
interface TimeTooltipComponentProps {
  label: string
  time: number
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

const TimeTooltipComponent: React.FC<React.PropsWithChildren<TimeTooltipComponentProps>> = ({ label, time }) => {
  const {
    t,
    currentLanguage: { locale },
  } = useTranslation()

  return (
    <>
      <Text bold>{t(label)}:</Text>
      <Text>
        {new Date(time * 1000).toLocaleString(locale, {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        })}
      </Text>
    </>
  )
}

export const SoonTimer: React.FC<React.PropsWithChildren<Props>> = ({ publicIfoData }) => {
  const { t } = useTranslation()
  const getNow = useLedgerTimestamp()
  const { startTime, endTime } = publicIfoData

  const currentTime = getNow() / 1000

  const secondsUntilStart = startTime - currentTime

  const timeUntil = getTimePeriods(secondsUntilStart)

  const status = getStatus(currentTime, startTime, endTime)

  const {
    targetRef: startTimeTargetRef,
    tooltip: startTimeTooltip,
    tooltipVisible: startTimeTooltipVisible,
  } = useTooltip(<TimeTooltipComponent label="Start Time" time={startTime} />, {
    placement: 'top',
  })

  return (
    <Flex justifyContent="center" position="relative">
      {status === 'idle' ? (
        <Skeleton animation="pulse" variant="rect" width="100%" height="48px" />
      ) : (
        <Flex ref={startTimeTargetRef}>
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
                  {!timeUntil.days && !timeUntil.hours && timeUntil.minutes === 0 ? '< 1' : timeUntil.minutes}
                </Heading>
                <Text color="secondary">{t('m')}</Text>
              </>
            </FlexGap>
          </FlexGap>
          <TimerIcon ml="4px" color="secondary" />
          {startTimeTooltipVisible && startTimeTooltip}
        </Flex>
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

const LiveTimer: React.FC<React.PropsWithChildren<Props>> = ({ publicIfoData }) => {
  const { t } = useTranslation()
  const getNow = useLedgerTimestamp()
  const { endTime, startTime } = publicIfoData

  const currentTime = getNow() / 1000

  const secondsUntilEnd = endTime - currentTime

  const status = getStatus(currentTime, startTime, endTime)

  const timeUntil = getTimePeriods(secondsUntilEnd)

  const {
    targetRef: endTimeTargetRef,
    tooltip: endTimeTooltip,
    tooltipVisible: endTimeTooltipVisible,
  } = useTooltip(<TimeTooltipComponent label="End Time" time={endTime} />, {
    placement: 'top',
  })

  return (
    <Flex justifyContent="center" position="relative">
      {status === 'idle' ? (
        <Skeleton animation="pulse" variant="rect" width="100%" height="48px" />
      ) : (
        <Flex color="white" ref={endTimeTargetRef}>
          <PocketWatchIcon width="42px" mr="8px" />
          <FlexGap gap="8px" alignItems="center">
            <LiveNowHeading textTransform="uppercase" as="h3">{`${t('Live Now')}!`}</LiveNowHeading>
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
                <GradientText scale="lg">
                  {!timeUntil.days && !timeUntil.hours && timeUntil.minutes === 0 ? '< 1' : timeUntil.minutes}
                </GradientText>
                <Text color="white">{t('m')}</Text>
              </>
            </FlexGap>
          </FlexGap>
          <span>
            <TimerIcon ml="4px" mt="10px" color="white" />
          </span>
          {endTimeTooltipVisible && endTimeTooltip}
        </Flex>
      )}
    </Flex>
  )
}

export default LiveTimer
