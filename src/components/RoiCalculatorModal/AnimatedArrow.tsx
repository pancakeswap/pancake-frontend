import { useState, useEffect } from 'react'
import { Flex, ArrowDownIcon, ArrowUpIcon } from '@pancakeswap/uikit'
import styled, { keyframes } from 'styled-components'
import { CalculatorMode, RoiCalculatorReducerState } from './useRoiCalculatorReducer'

const rotate = keyframes`
  0% {
    transform: scale(1);
    stroke-width: 0;
  }
  50% {
    transform: scale(1.3);
    stroke-width: 2;
  }
  100% {
    transform: scale(1);
    stroke-width: 0;
  }
`

const ArrowContainer = styled(Flex)`
  & > svg {
    animation: 0.2s ${rotate} linear;
    stroke: ${({ theme }) => `${theme.colors.primary}3D`};
    stroke-width: 0;
  }
`

interface AnimatedArrowProps {
  calculatorState: RoiCalculatorReducerState
}

const AnimatedArrow: React.FC<AnimatedArrowProps> = ({ calculatorState }) => {
  const [key, setKey] = useState('roiArrow-0')
  const { mode } = calculatorState.controls

  // Trigger animation on state change
  useEffect(() => {
    setKey((prevKey) => {
      const prevId = parseInt(prevKey.split('-')[1], 10)
      return `roiArrow-${prevId + 1}`
    })
  }, [calculatorState])

  return (
    <ArrowContainer justifyContent="center" my="24px" key={key}>
      {mode === CalculatorMode.ROI_BASED_ON_PRINCIPAL ? (
        <ArrowDownIcon width="24px" height="24px" color="textSubtle" />
      ) : (
        <ArrowUpIcon width="24px" height="24px" color="textSubtle" />
      )}
    </ArrowContainer>
  )
}

export default AnimatedArrow
