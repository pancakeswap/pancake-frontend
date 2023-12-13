import { useTranslation } from '@pancakeswap/localization'
import { styled } from 'styled-components'
import { Flex, Heading, PocketWatchIcon, Text, Skeleton, Link, TimerIcon } from '@pancakeswap/uikit'
import getTimePeriods from '@pancakeswap/utils/getTimePeriods'
import useCurrentBlockTimestamp from 'hooks/useCurrentBlockTimestamp'
import { getBlockExploreLink } from 'utils'
import { PublicIfoData } from 'views/Ifos/types'
import { useActiveChainId } from 'hooks/useActiveChainId'

interface Props {
  publicIfoData: PublicIfoData
  dark?: boolean
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

const USE_BLOCK_TIMESTAMP_UNTIL = 3

export const SoonTimer: React.FC<React.PropsWithChildren<Props>> = ({ publicIfoData, dark }) => {
  const { chainId } = useActiveChainId()
  const { t } = useTranslation()
  const { status, secondsUntilStart, startBlockNum } = publicIfoData
  const currentBlockTimestamp = useCurrentBlockTimestamp()
  const isLegacyBlockCountdown = typeof startBlockNum === 'number'
  const now = isLegacyBlockCountdown ? currentBlockTimestamp : Math.floor(Date.now() / 1000)
  const hoursLeft = publicIfoData.plannedStartTime && now ? (publicIfoData.plannedStartTime - Number(now)) / 3600 : 0
  const fallbackToBlockTimestamp = hoursLeft > USE_BLOCK_TIMESTAMP_UNTIL
  let timeUntil: ReturnType<typeof getTimePeriods> | undefined
  if (fallbackToBlockTimestamp) {
    timeUntil = getTimePeriods((publicIfoData?.plannedStartTime || Number(now)) - Number(now))
  } else {
    timeUntil = getTimePeriods(secondsUntilStart)
  }
  const textColor = dark ? '#EFF3F4' : '#674F9C'

  const countdownDisplay =
    status !== 'idle' ? (
      <>
        <FlexGap gap="8px" alignItems="center">
          <Heading as="h3" scale="lg" color={textColor}>
            {t('Starts in')}
          </Heading>
          <FlexGap gap="4px" alignItems="baseline">
            {timeUntil.days ? (
              <>
                <Heading scale="lg" color={textColor}>
                  {timeUntil.days}
                </Heading>
                <Text color={textColor}>{t('d')}</Text>
              </>
            ) : null}
            {timeUntil.days || timeUntil.hours ? (
              <>
                <Heading color={textColor} scale="lg">
                  {timeUntil.hours}
                </Heading>
                <Text color={textColor}>{t('h')}</Text>
              </>
            ) : null}
            <>
              <Heading color={textColor} scale="lg">
                {!timeUntil.days && !timeUntil.hours && timeUntil.minutes === 0 ? '< 1' : timeUntil.minutes}
              </Heading>
              <Text color={textColor}>{t('m')}</Text>
            </>
          </FlexGap>
        </FlexGap>
        <TimerIcon ml="4px" color={textColor} />
      </>
    ) : null

  const countdown = isLegacyBlockCountdown ? (
    <Link external href={getBlockExploreLink(startBlockNum, 'countdown', chainId)} color={textColor}>
      {countdownDisplay}
    </Link>
  ) : (
    countdownDisplay
  )

  return (
    <Flex justifyContent="center" position="relative">
      {status === 'idle' ? <Skeleton animation="pulse" variant="rect" width="100%" height="48px" /> : countdown}
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
  const { chainId } = useActiveChainId()
  const { t } = useTranslation()
  const { status, secondsUntilEnd, endBlockNum } = publicIfoData
  const isLegacyBlockCountdown = typeof endBlockNum === 'number'
  const timeUntil = getTimePeriods(secondsUntilEnd)

  const timeDisplay =
    status !== 'idle' ? (
      <>
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
        <TimerIcon ml="4px" color="white" />
      </>
    ) : null

  const timeNode = isLegacyBlockCountdown ? (
    <Link external href={getBlockExploreLink(endBlockNum, 'countdown', chainId)} color="white">
      {timeDisplay}
    </Link>
  ) : (
    timeDisplay
  )

  return (
    <Flex justifyContent="center" position="relative">
      {status === 'idle' ? <Skeleton animation="pulse" variant="rect" width="100%" height="48px" /> : timeNode}
    </Flex>
  )
}

export default LiveTimer
