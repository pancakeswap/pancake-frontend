import React from 'react'
import styled from 'styled-components'
import { Flex, Text } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import MultiplierUp from '../../icons/MultiplierUp'
import MultiplierDown from '../../icons/MultiplierDown'
import { PositionType } from './types'
import EnteredTag from './EnteredTag'

interface MultiplierArrowProps {
  multiplier: number
  hasEntered: boolean
  positionType?: PositionType
  isActive?: boolean
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

const MultiplierArrow: React.FC<MultiplierArrowProps> = ({
  multiplier,
  hasEntered,
  positionType = 'up',
  isActive = false,
}) => {
  const TranslateString = useI18n()
  const multiplierText = (
    <Flex>
      <Text color={isActive ? 'white' : 'textSubtle'} bold lineHeight="21px">{`${multiplier}x`}</Text>
      <Text color={isActive ? 'white' : 'textSubtle'} lineHeight="21px" ml="4px">
        {TranslateString(999, 'Payout')}
      </Text>
    </Flex>
  )

  if (positionType === 'down') {
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
          <Text bold fontSize="24px" lineHeight="26px" color={isActive ? 'white' : 'failure'}>
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
        <Text bold fontSize="24px" lineHeight="26px" color={isActive ? 'white' : 'success'}>
          {TranslateString(999, 'Up')}
        </Text>
        {multiplierText}
      </Content>
    </ArrowWrapper>
  )
}

export default MultiplierArrow
