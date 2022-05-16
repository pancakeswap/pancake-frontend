import { Box, Flex, Heading, Progress, ProgressBar } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import styled from 'styled-components'
import { PublicIfoData } from '../../types'
import LiveTimer, { SoonTimer } from './Timer'

const BigCurve = styled(Box)<{ $status: PublicIfoData['status'] }>`
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

export const IfoRibbon = ({ publicIfoData }: { publicIfoData: PublicIfoData }) => {
  const { status } = publicIfoData

  let Component
  if (status === 'finished') {
    Component = <IfoRibbonEnd />
  } else if (status === 'live') {
    Component = <IfoRibbonLive publicIfoData={publicIfoData} />
  } else if (status === 'coming_soon') {
    Component = <IfoRibbonSoon publicIfoData={publicIfoData} />
  }

  if (status === 'idle') {
    return null
  }

  return (
    <>
      {status === 'live' && (
        <Progress variant="flat">
          <ProgressBar
            $useDark
            $background="linear-gradient(273deg, #ffd800 -2.87%, #eb8c00 113.73%)"
            style={{ width: `${Math.min(Math.max(publicIfoData.progress, 0), 100)}%` }}
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
