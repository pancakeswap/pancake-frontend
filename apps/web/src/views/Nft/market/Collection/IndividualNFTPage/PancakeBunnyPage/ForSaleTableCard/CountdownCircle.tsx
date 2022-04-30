import { Spinner, Text } from '@pancakeswap/uikit'

import styled, { keyframes } from 'styled-components'

const countdownAnimation = keyframes`
  from {
    stroke-dashoffset: 0px;
  }
  to {
    stroke-dashoffset: 113px;
  }
`

const CountdownContainer = styled.div`
  position: relative;
  margin: auto;
  height: 40px;
  width: 40px;
  text-align: center;

  & svg {
    position: absolute;
    top: 0;
    right: 0;
    width: 40px;
    height: 40px;
    transform: rotateY(-180deg) rotateZ(-90deg);

    & circle {
      stroke-dasharray: 113px;
      stroke-dashoffset: 0px;
      stroke-linecap: round;
      stroke-width: 2px;
      stroke: ${({ theme }) => theme.colors.primaryBright};
      fill: none;
      animation: ${countdownAnimation} 10s linear infinite forwards;
    }
  }
`

interface CountdownCircleProps {
  secondsRemaining: number
  isUpdating: boolean
}

const CountdownCircle: React.FC<CountdownCircleProps> = ({ secondsRemaining, isUpdating }) => {
  if (secondsRemaining < 1 || isUpdating) {
    return <Spinner size={42} />
  }
  return (
    <CountdownContainer>
      <Text color="textSubtle" lineHeight="40px" display="inline-block">
        {secondsRemaining}
      </Text>
      <svg>
        <circle r="18" cx="20" cy="20" />
      </svg>
    </CountdownContainer>
  )
}

export default CountdownCircle
