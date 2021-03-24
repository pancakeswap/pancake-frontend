import React from 'react'
import styled from 'styled-components'
import { Flex } from '@pancakeswap-libs/uikit'
import { CountdownProps } from '../../types'
import Step from './Step'

const Wrapper = styled.div``

const ProgressStepper: React.FC<CountdownProps> = ({ steps, activeStepIndex }) => {
  return (
    <Wrapper>
      <Flex>
        {steps.map((stepText) => (
          <Step stepText={stepText.toUpperCase()} activeStepIndex={activeStepIndex} />
        ))}
      </Flex>
    </Wrapper>
  )
}

export default ProgressStepper
