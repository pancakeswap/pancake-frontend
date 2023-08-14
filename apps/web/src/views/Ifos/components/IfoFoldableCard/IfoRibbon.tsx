import { Box, Flex, Heading, Progress, ProgressBar } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { styled } from 'styled-components'
import { ChainId } from '@pancakeswap/sdk'
import { ReactNode } from 'react'

import { PublicIfoData } from '../../types'
import LiveTimer, { SoonTimer } from './Timer'
import { IfoChainBoard } from '../IfoChainBoard'

const Container = styled(Box)`
  position: relative;
`

const BigCurve = styled(Box) <{ $status: PublicIfoData['status'] }>`
  width: 150%;
  position: absolute;
  top: -150%;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1;

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

const RibbonContainer = styled(Box)`
  z-index: 2;
  position: relative;
`

const ChainBoardContainer = styled(Box)`
  position: absolute;
  top: -4rem;
  left: 50%;

  ${({ theme }) => theme.mediaQueries.sm} {
    left: unset;
    top: unset;
    right: 90px;
    bottom: 3px;
  }
`

export const IfoRibbon = ({ ifoChainId, publicIfoData }: { ifoChainId?: ChainId; publicIfoData: PublicIfoData }) => {
  const { status } = publicIfoData

  let ribbon: ReactNode = null
  switch (status) {
    case 'finished':
      ribbon = <IfoRibbonEnd />
      break
    case 'live':
      ribbon = <IfoRibbonLive publicIfoData={publicIfoData} />
      break
    case 'coming_soon':
      ribbon = <IfoRibbonSoon publicIfoData={publicIfoData} />
      break
    default:
      ribbon = null
  }

  if (status === 'idle') {
    return null
  }

  return (
    <Container>
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
        zIndex={1}
      >
        {ribbon}
      </Flex>
      <ChainBoardContainer zIndex={2}>
        <IfoChainBoard chainId={ifoChainId} />
      </ChainBoardContainer>
    </Container>
  )
}

const IfoRibbonEnd = () => {
  const { t } = useTranslation()
  return (
    <>
      <BigCurve $status="finished" />
      <RibbonContainer>
        <Heading as="h3" scale="lg" color="textSubtle">
          {t('Sale Finished!')}
        </Heading>
      </RibbonContainer>
    </>
  )
}

const IfoRibbonSoon = ({ publicIfoData }: { publicIfoData: PublicIfoData }) => {
  return (
    <>
      <BigCurve $status="coming_soon" />
      <RibbonContainer>
        <Heading as="h3" scale="lg" color="secondary">
          <SoonTimer publicIfoData={publicIfoData} />
        </Heading>
      </RibbonContainer>
    </>
  )
}

const IfoRibbonLive = ({ publicIfoData }: { publicIfoData: PublicIfoData }) => {
  return (
    <>
      <BigCurve $status="live" />
      <RibbonContainer>
        <LiveTimer publicIfoData={publicIfoData} />
      </RibbonContainer>
    </>
  )
}
