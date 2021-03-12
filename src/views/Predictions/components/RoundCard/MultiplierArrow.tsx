import React from 'react'
import styled from 'styled-components'
import { Flex, Text } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import { Position } from 'state/types'
import MultiplierUp from '../../icons/MultiplierUp'
import MultiplierDown from '../../icons/MultiplierDown'
import EnteredTag from './EnteredTag'

interface MultiplierArrowProps {
  multiplier?: number
  hasEntered?: boolean
  roundPosition?: Position
  isActive?: boolean
  isDisabled?: boolean
}

const ArrowWrapper = styled.div`
  height: 80px;
  margin: 0 auto;
  position: relative;
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
  left: 0;
  position: absolute;
  top: 0;
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
  multiplier,
  hasEntered = false,
  roundPosition = Position.UP,
  isActive = false,
  isDisabled = false,
}) => {
  const TranslateString = useI18n()
  const upColor = getTextColor('success')(isActive, isDisabled)
  const downColor = getTextColor('failure')(isActive, isDisabled)
  const textColor = getTextColor()(isActive, isDisabled)
  const multiplierText = (
    <Flex>
      <Text color={textColor} bold lineHeight="21px">
        {multiplier ? `${multiplier}x` : '~'}
      </Text>
      <Text color={textColor} lineHeight="21px" ml="4px">
        {TranslateString(999, 'Payout')}
      </Text>
    </Flex>
  )

  if (roundPosition === Position.DOWN) {
    return (
      <ArrowWrapper>
        <MultiplierDown isActive={isActive} />
        {hasEntered && (
          <EnteredTagWrapper>
            <EnteredTag />
          </EnteredTagWrapper>
        )}
        <Content>
          {multiplierText}
          <Text bold fontSize="24px" lineHeight="26px" color={downColor}>
            {TranslateString(999, 'Down')}
          </Text>
        </Content>
      </ArrowWrapper>
    )
  }

  return (
    <ArrowWrapper>
      <MultiplierUp isActive={isActive} />
      {hasEntered && (
        <EnteredTagWrapper>
          <EnteredTag />
        </EnteredTagWrapper>
      )}
      <Content>
        <Text bold fontSize="24px" lineHeight="26px" color={upColor}>
          {TranslateString(999, 'Up')}
        </Text>
        {multiplierText}
      </Content>
    </ArrowWrapper>
  )
}

export default MultiplierArrow
