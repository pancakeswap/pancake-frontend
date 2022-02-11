import React from 'react'
import styled from 'styled-components'
import { Text } from '@pancakeswap/uikit'

const ProgressWrap = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  width: 635px;
  margin: auto auto 32px auto;

  &:before {
    content: '';
    position: absolute;
    top: 24px;
    left: 32%;
    width: 274px;
    height: 1px;
    background: ${({ theme }) => theme.colors.textDisabled};
  }
`

const Circle = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;

  width: 48px;
  height: 48px;
  color: #ffffff;
  font-size: 32px;
  border-radius: 50%;
  margin-bottom: 18px;
`

const Step = styled.div<{ confirmed?: boolean; disabled?: boolean }>`
  display: flex;
  align-items: center;
  flex-direction: column;

  ${Circle} {
    background: ${({ theme, confirmed, disabled }) =>
      disabled
        ? theme.colors.textDisabled
        : confirmed
        ? 'linear-gradient(180deg, #8051D6 0%, #492286 100%)'
        : theme.colors.textSubtle};
  }

  ${Text} {
    color: ${({ theme, confirmed, disabled }) =>
      disabled
        ? theme.colors.textDisabled
        : confirmed
        ? 'linear-gradient(180deg, #8051D6 0%, #492286 100%)'
        : theme.colors.textSubtle};
  }
`

interface ProgressCirclesProps {
  disabled?: boolean
}

const ProgressSteps = ({ disabled = false }: ProgressCirclesProps) => {
  return (
    <ProgressWrap>
      <Step>
        <Circle>1</Circle>
        <Text width={314} textAlign="center">
          Unstaking LP tokens and CAKE from the old MasterChef
        </Text>
      </Step>
      <Step disabled={true}>
        <Circle>2</Circle>
        <Text width={224} textAlign="center">
          Restake LP tokens and CAKE to the new MasterChef v2
        </Text>
      </Step>
    </ProgressWrap>
  )
}

export default ProgressSteps
