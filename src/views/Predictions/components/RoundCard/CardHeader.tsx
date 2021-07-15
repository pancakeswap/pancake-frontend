import React, { ReactElement } from 'react'
import { BlockIcon, Flex, FlexProps, PlayCircleOutlineIcon, Text, WaitIcon } from '@pancakeswap/uikit'
import get from 'lodash/get'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import useCountdown from 'views/Predictions/hooks/useCountdown'
import { formatRoundTime } from 'views/Predictions/helpers'
import getTimePeriods from 'utils/getTimePeriods'

interface BaseCardHeaderProps extends FlexProps {
  epoch: number
}

interface CardHeaderPropsWithTimestamp extends BaseCardHeaderProps {
  timestamp: number
}

interface TitleProps extends FlexProps {
  icon: ReactElement
}

const BaseCardHeader = styled(Flex).attrs({ alignItems: 'center', justifyContent: 'space-between' })<{ bgKey: string }>`
  background: ${({ theme, bgKey }) => (bgKey === 'transparent' ? 'transparent' : get(theme, bgKey))};
  border-radius: 16px 16px 0 0;
`

const Title: React.FC<TitleProps> = ({ icon, children }) => (
  <Flex alignItems="center">
    {icon}
    {children}
  </Flex>
)

export const ExpiredRoundCardHeader: React.FC<CardHeaderPropsWithTimestamp> = ({ epoch, timestamp }) => {
  const { t } = useTranslation()
  const now = Math.floor(Date.now() / 1000)
  const { minutes } = getTimePeriods(now - timestamp)

  return (
    <BaseCardHeader p="8px" bgKey="colors.cardBorder">
      <Title icon={<BlockIcon mr="4px" width="21px" color="textDisabled" />}>
        <Text color="textDisabled">{t('Expired')}</Text>
      </Title>
      <Flex alignItems="center">
        <Text fontSize="14px" color="textDisabled" textAlign="center">
          {`-${minutes}m`}
        </Text>
        <Text fontSize="14px" color="textDisabled" px="4px">
          |
        </Text>
        <Text fontSize="12px" color="textDisabled" textAlign="center">
          {`#${epoch}`}
        </Text>
      </Flex>
    </BaseCardHeader>
  )
}

export const SoonRoundCardHeader: React.FC<BaseCardHeaderProps> = ({ epoch }) => {
  const { t } = useTranslation()

  return (
    <BaseCardHeader p="8px" bgKey="colors.cardBorder">
      <Title icon={<WaitIcon mr="4px" width="21px" color="text" />}>
        <Text color="text">{t('Later')}</Text>
      </Title>
      <Text fontSize="12px" color="text" textAlign="center">
        {`#${epoch}`}
      </Text>
    </BaseCardHeader>
  )
}

export const CalculatingRoundCardHeader: React.FC<BaseCardHeaderProps> = ({ epoch }) => {
  const { t } = useTranslation()

  return (
    <BaseCardHeader p="8px" bgKey="colors.gradients.cardHeader">
      <Title icon={<WaitIcon mr="4px" width="21px" />}>
        <Text color="text">{t('Calculating')}</Text>
      </Title>
      <Text fontSize="12px" color="text" textAlign="center">
        {`#${epoch}`}
      </Text>
    </BaseCardHeader>
  )
}

export const CanceledRoundCardHeader: React.FC<BaseCardHeaderProps> = ({ epoch }) => {
  const { t } = useTranslation()

  return (
    <BaseCardHeader p="8px" bgKey="colors.warning">
      <Title icon={<BlockIcon mr="4px" width="21px" />}>
        <Text color="text">{t('Calculating')}</Text>
      </Title>
      <Text fontSize="12px" color="text" textAlign="center">
        {`#${epoch}`}
      </Text>
    </BaseCardHeader>
  )
}

export const LiveRoundCardHeader: React.FC<CardHeaderPropsWithTimestamp> = ({ epoch, timestamp }) => {
  const { t } = useTranslation()
  const { secondsRemaining } = useCountdown(timestamp)
  const countdown = formatRoundTime(secondsRemaining)

  return (
    <BaseCardHeader p="16px" bgKey="transparent">
      <Title icon={<PlayCircleOutlineIcon mr="4px" width="24px" color="secondary" />}>
        <Text color="secondary" textTransform="uppercase" fontWeight="bold">
          {t('Live')}
        </Text>
      </Title>
      <Flex alignItems="center">
        <Text fontSize="14px" color="secondary" textAlign="center">
          {countdown}
        </Text>
        <Text fontSize="14px" color="secondary" px="4px">
          |
        </Text>
        <Text fontSize="14px" color="secondary" textAlign="center">
          {`#${epoch}`}
        </Text>
      </Flex>
    </BaseCardHeader>
  )
}

export const OpenRoundCardHeader: React.FC<CardHeaderPropsWithTimestamp> = ({ epoch, timestamp }) => {
  const { t } = useTranslation()
  const { secondsRemaining } = useCountdown(timestamp)
  const countdown = formatRoundTime(secondsRemaining)

  return (
    <BaseCardHeader p="8px" bgKey="colors.secondary">
      <Title icon={<PlayCircleOutlineIcon color="white" mr="4px" width="21px" />}>
        <Text color="white" textTransform="uppercase" fontWeight="bold">
          {t('Next')}
        </Text>
      </Title>
      <Flex alignItems="center">
        <Text fontSize="14px" color="white" textAlign="center">
          {countdown}
        </Text>
        <Text fontSize="14px" color="white" px="4px">
          |
        </Text>
        <Text fontSize="14px" color="white" textAlign="center">
          {`#${epoch}`}
        </Text>
      </Flex>
    </BaseCardHeader>
  )
}
