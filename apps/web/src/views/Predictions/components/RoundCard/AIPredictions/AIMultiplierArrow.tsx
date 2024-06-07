import { useTranslation } from '@pancakeswap/localization'
import { BetPosition } from '@pancakeswap/prediction'
import { Box, Flex, Text } from '@pancakeswap/uikit'
import { CSSProperties } from 'react'
import { styled } from 'styled-components'
import { RoundMultiplierDownArrow, RoundMultiplierUpArrow } from '../../../RoundMultiplierArrows'
import { AIEnteredTag } from './AIEnteredTag'

interface AIMultiplierArrowProps {
  betAmount?: bigint
  multiplier?: string
  hasEntered?: boolean
  hasClaimed?: boolean
  betPosition?: BetPosition
  isDisabled?: boolean
  isActive?: boolean
  isHouse?: boolean

  hasEnteredAgainst?: boolean
}

const ArrowWrapper = styled.div`
  height: 65px;
  margin: 0 auto;
  width: 240px;
`

const Content = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  left: 0;
  height: 100%;
  justify-content: center;
  position: absolute;
  top: 0;
  width: 100%;
`

const EnteredTagWrapper = styled.div`
  position: absolute;
  z-index: 10;
`

const getTextColor =
  (fallback = 'textSubtle') =>
  (isActive: boolean, isDisabled: boolean, isHouse: boolean) => {
    if (isDisabled || isHouse) {
      return 'textDisabled'
    }

    if (isActive) {
      return 'white'
    }

    return fallback
  }

export const AIMultiplierArrow: React.FC<React.PropsWithChildren<AIMultiplierArrowProps>> = ({
  betAmount,
  multiplier,
  hasEntered = false,
  hasClaimed = false,
  betPosition = BetPosition.BULL,
  isDisabled = false,
  isActive = false,
  isHouse = false,
  hasEnteredAgainst = false,
}) => {
  const { t } = useTranslation()
  const upColor = getTextColor('success')(isActive, isDisabled, isHouse)
  const downColor = getTextColor('failure')(isActive, isDisabled, isHouse)
  const textColor = getTextColor('text')(isActive, isDisabled, isHouse)
  const multiplierText = (
    <Box>
      <Flex justifyContent="center">
        <Text fontSize="12px" color={textColor} bold lineHeight="14x">
          {multiplier !== undefined ? `${multiplier}x` : '-'}
        </Text>
        <Text fontSize="12px" color={textColor} lineHeight="14x" ml="4px">
          {t('Payout')}
        </Text>
      </Flex>
    </Box>
  )

  const getEnteredTag = (position: CSSProperties) => {
    if (!hasEntered) {
      return null
    }

    return (
      <EnteredTagWrapper style={position}>
        <AIEnteredTag amount={betAmount} hasClaimed={hasClaimed} multiplier={multiplier ?? ''} />
      </EnteredTagWrapper>
    )
  }

  if (betPosition === BetPosition.BEAR) {
    return (
      <Box mt="-1px" position="relative">
        <ArrowWrapper>
          <RoundMultiplierDownArrow isActive={isActive} />
          {getEnteredTag({ bottom: 40, right: 40 })}
          <Content>
            <Text fontSize={hasEnteredAgainst ? '12px' : '14px'} bold>
              {t('%against%AI Prediction', {
                against: hasEnteredAgainst ? t('Against ') : '',
              })}
            </Text>
            <Text bold fontSize="14px" lineHeight="14px" color={downColor} textTransform="uppercase">
              {t('Down')}
            </Text>
            {!isDisabled && hasEntered && multiplierText}
          </Content>
        </ArrowWrapper>
      </Box>
    )
  }

  return (
    <Box mb="-1px" position="relative">
      <ArrowWrapper>
        <RoundMultiplierUpArrow isActive={isActive} />
        {getEnteredTag({ top: 40, right: 40 })}
        <Content>
          <Text mt="16px" fontSize={hasEnteredAgainst ? '12px' : '14px'} bold>
            {t('%against%AI Prediction', {
              against: hasEnteredAgainst ? t('Against ') : '',
            })}
          </Text>
          <Text bold fontSize="14px" lineHeight="14px" color={upColor} textTransform="uppercase">
            {t('Up')}
          </Text>
          {!isDisabled && hasEntered && multiplierText}
        </Content>
      </ArrowWrapper>
    </Box>
  )
}
