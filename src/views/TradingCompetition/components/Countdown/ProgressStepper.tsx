import React from 'react'
import styled from 'styled-components'
import { Flex } from '@pancakeswap-libs/uikit'
import { CountdownProps } from '../../types'
import Step from './Step'

const Wrapper = styled.div``

const Spacer = styled.div<{ isPastSpacer?: boolean }>`
  margin: 12px 8px 0 8px;
  width: 36px;
  background-color: ${({ isPastSpacer, theme }) =>
    isPastSpacer ? theme.colors.textSubtle : theme.colors.textDisabled};
  height: 2px;
  border-radius: 4px;
`

const ProgressStepper: React.FC<CountdownProps> = ({ steps, activeStepIndex }) => {
  return (
    <Wrapper>
      <Flex>
        {steps.map((stepText, index) => {
          const isPastSpacer = index < activeStepIndex

          return (
            <>
              <Step stepText={stepText.toUpperCase()} index={index} activeStepIndex={activeStepIndex} />
              {index + 1 < steps.length && <Spacer isPastSpacer={isPastSpacer} />}
            </>
          )
        })}
      </Flex>
    </Wrapper>
  )
}

export default ProgressStepper
