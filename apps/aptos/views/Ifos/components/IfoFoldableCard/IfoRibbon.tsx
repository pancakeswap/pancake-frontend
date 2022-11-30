import { Box, Flex, Heading, Progress, ProgressBar } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import styled from 'styled-components'
import { getStatus } from 'views/Ifos/hooks/helpers'
import { PublicIfoData } from '../../types'
import LiveTimer, { SoonTimer } from './Timer'

const BigCurve = styled(Box)<{ $status }>`
  width: 150%;
  position: absolute;
  top: -150%;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);

  ${({ theme }) => theme.mediaQueries.md} {
    border-radius: 50%;
  }

  ${({ $status, theme }) => {
    switch ($status) {
      case 'coming_soon':
        return `
          background: ${theme.colors.tertiary};
        `
      case 'live':
        return `
          background: linear-gradient(#8051D6 100%, #492286 100%);
        `
      case 'finished':
        return `
          background: ${theme.colors.input};
        `
      default:
        return ''
    }
  }}
`

export const IfoRibbon = ({ publicIfoData, releaseTime }: { publicIfoData: PublicIfoData; releaseTime: number }) => {
  const { startTime, endTime } = publicIfoData

  const currentTime = Date.now() / 1000

  const status = getStatus(currentTime, startTime, endTime)

  if (!startTime || !endTime || status === 'idle') {
    return null
  }

  let Component
  if (status === 'finished') {
    Component = <IfoRibbonEnd />
  } else if (status === 'live') {
    Component = <IfoRibbonLive publicIfoData={publicIfoData} />
  } else if (status === 'coming_soon') {
    Component = <IfoRibbonSoon publicIfoData={publicIfoData} />
  }

  const totalTime = endTime - startTime

  const progress =
    currentTime > startTime
      ? ((currentTime - startTime) / totalTime) * 100
      : ((currentTime - releaseTime) / (startTime - releaseTime)) * 100

  return (
    <>
      {status === 'live' && (
        <Progress variant="flat">
          <ProgressBar
            $useDark
            $background="linear-gradient(273deg, #ffd800 -2.87%, #eb8c00 113.73%)"
            style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
          />
        </Progress>
      )}
      <Flex
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        minHeight={['48px', '48px', '48px', '75px']}
        position="relative"
        overflow="hidden"
      >
        {Component}
      </Flex>
    </>
  )
}

const IfoRibbonEnd = () => {
  const { t } = useTranslation()
  return (
    <>
      <BigCurve $status="finished" />
      <Box position="relative">
        <Heading as="h3" scale="lg" color="textSubtle">
          {t('Sale Finished!')}
        </Heading>
      </Box>
    </>
  )
}

const IfoRibbonSoon = ({ publicIfoData }: { publicIfoData: PublicIfoData }) => {
  return (
    <>
      <BigCurve $status="coming_soon" />
      <Box position="relative">
        <Heading as="h3" scale="lg" color="secondary">
          <SoonTimer publicIfoData={publicIfoData} />
        </Heading>
      </Box>
    </>
  )
}

const IfoRibbonLive = ({ publicIfoData }: { publicIfoData: PublicIfoData }) => {
  return (
    <>
      <BigCurve $status="live" />
      <Box position="relative">
        <LiveTimer publicIfoData={publicIfoData} />
      </Box>
    </>
  )
}
