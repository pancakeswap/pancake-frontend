import React from 'react'
import styled from 'styled-components'
import { Flex } from '@pancakeswap-libs/uikit'
import { CountdownProps } from '../../types'

const Step: React.FC<CountdownProps> = ({ stepText, activeStepIndex }) => {
  return <span>{stepText}</span>
}

export default Step
