import { ArrowForwardIcon } from '@pancakeswap/uikit'
import { styled } from 'styled-components'

const CountdownContainer = styled.div<{ $percentage: number }>`
  position: relative;
  margin-left: auto;
  height: 20px;
  width: 20px;
  min-width: 20px;

  >svg: first-child {
    position: absolute;
    top: 0;
    right: 0;
    width: 20px;
    height: 20px;
    transform: rotateY(-180deg) rotateZ(-90deg);
    stroke-width: 2px;
    > circle {
      fill: none;
      stroke-width: 2px;
      stroke-linecap: round;
      stroke-dasharray: 120px;
    }
    > circle:first-child {
      stroke-dashoffset: 0px;
      stroke: ${({ theme }) => theme.colors.cardBorder};
    }
    > circle:nth-child(2) {
      stroke: ${({ theme }) => theme.colors.primaryBright};
      stroke-dashoffset: ${({ $percentage }) => `${105 * $percentage}px`};
    }
  }

  > svg:nth-child(2) {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0.75);
  }
`

export const Countdown = ({ percentage }: { percentage: number }) => {
  return (
    <CountdownContainer $percentage={percentage}>
      <svg>
        <circle r="9" cx="10" cy="10" />
        <circle r="9" cx="10" cy="10" />
      </svg>
      <ArrowForwardIcon color="primary" />
    </CountdownContainer>
  )
}
