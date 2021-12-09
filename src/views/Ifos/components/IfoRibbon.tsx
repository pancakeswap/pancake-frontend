import { Box, Flex, Heading, Progress } from '@pancakeswap/uikit'
import { Ifo } from 'config/constants/types'
import { useTranslation } from 'contexts/Localization'
import React from 'react'
import styled from 'styled-components'
import { PublicIfoData } from '../types'
import Timer from './IfoFoldableCard/Timer'

const BigCurve = styled.div<{ $background: string }>`
  width: 150%;
  position: absolute;
  background: ${({ $background }) => $background};
  border-radius: 50%;
  top: -150%;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
`

export const IfoRibbon = ({ ifo, publicIfoData }: { ifo: Ifo; publicIfoData: PublicIfoData }) => {
  const { status } = publicIfoData

  let Component
  if (status === 'finished' && ifo.isActive) {
    Component = <IfoRibbonEnd />
  } else if (status === 'live') {
    Component = <IfoRibbonLive publicIfoData={publicIfoData} />
  } else if (status === 'coming_soon') {
    Component = <IfoRibbonSoon />
  }

  return (
    <>
      {status === 'live' && <Progress variant="flat" useDark primaryStep={publicIfoData.progress} />}
      <Flex
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        height="75px"
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
      <BigCurve $background="#EFEAF5" />
      <Box position="relative">
        <Heading as="h3" scale="lg" color="textSubtle">
          ˝{t('Sale Finished!')}
        </Heading>
      </Box>
    </>
  )
}

const IfoRibbonSoon = () => {
  const { t } = useTranslation()
  return (
    <>
      <BigCurve $background="#EEF3F5" />
      <Box position="relative">
        <Heading as="h3" scale="lg" color="secondary">
          {t('Start in')}
        </Heading>
      </Box>
    </>
  )
}

const IfoRibbonLive = ({ publicIfoData }: { publicIfoData: PublicIfoData }) => {
  return (
    <>
      <BigCurve $background="linear-gradient(269.54deg, #8051D6 14.31%, #492286 103.21%)" />
      <Box position="relative">
        <Timer publicIfoData={publicIfoData} />
      </Box>
    </>
  )
}
