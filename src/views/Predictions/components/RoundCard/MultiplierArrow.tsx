import React from 'react'
import styled, { CSSProperties } from 'styled-components'
import { Box, Flex, Text } from '@pancakeswap-libs/uikit'
import { useTranslation } from 'contexts/Localization'
import { BetPosition } from 'state/types'
import { RoundMultiplierDownArrow, RoundMultiplierUpArrow } from '../../RoundMultiplierArrows'
import EnteredTag from './EnteredTag'

interface MultiplierArrowProps {
  amount?: number
  multiplier?: number
  hasEntered?: boolean
  betPosition?: BetPosition
  isDisabled?: boolean
  isActive?: boolean
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

const getTextColor = (fallback = 'textSubtle') => (isActive: boolean, isDisabled: boolean) => {
  if (isDisabled) {
    return 'textDisabled'
  }

  if (isActive) {
    return 'white'
  }

  return fallback
}

const MultiplierArrow: React.FC<MultiplierArrowProps> = ({
  amount,
  multiplier,
  hasEntered = false,
  betPosition = BetPosition.BULL,
  isDisabled = false,
  isActive = false,
}) => {
  const { t } = useTranslation()
  const upColor = getTextColor('success')(isActive, isDisabled)
  const downColor = getTextColor('failure')(isActive, isDisabled)
  const textColor = getTextColor()(isActive, isDisabled)
  const multiplierText = (
    <Flex>
      <Text color={textColor} bold lineHeight="21px">
        {multiplier !== undefined ? `${multiplier.toLocaleString(undefined, { maximumFractionDigits: 2 })}x` : '-'}
      </Text>
      <Text color={textColor} lineHeight="21px" ml="4px">
        {t('Payout')}
      </Text>
    </Flex>
  )

  const getEnteredTag = (position: CSSProperties) => {
    if (!hasEntered) {
      return null
    }

    return (
      <EnteredTagWrapper style={position}>
        <EnteredTag amount={amount} />
      </EnteredTagWrapper>
    )
  }

  if (betPosition === BetPosition.BEAR) {
    return (
      <Box position="relative">
        <ArrowWrapper>
          <RoundMultiplierDownArrow isActive={isActive} />
          {getEnteredTag({ bottom: 0, right: 0 })}
          <Content>
            {!isDisabled && multiplierText}
            <Text bold fontSize="24px" lineHeight="26px" mb="8px" color={downColor} textTransform="uppercase">
              {t('Down')}
            </Text>
          </Content>
        </ArrowWrapper>
      </Box>
    )
  }

  return (
    <Box position="relative">
      <ArrowWrapper>
        <RoundMultiplierUpArrow isActive={isActive} />
        {getEnteredTag({ top: 0, left: 0 })}
        <Content>
          <Text bold fontSize="24px" lineHeight="26px" color={upColor} textTransform="uppercase">
            {t('Up')}
          </Text>
          {!isDisabled && multiplierText}
        </Content>
      </ArrowWrapper>
    </Box>
  )
}

export default MultiplierArrow
