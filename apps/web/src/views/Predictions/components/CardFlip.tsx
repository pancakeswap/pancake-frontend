import { ReactNode } from 'react'
import { styled } from 'styled-components'

interface CardFlipProps {
  isFlipped: boolean
  height: string
  children: [ReactNode, ReactNode]
}

const Front = styled.div`
  align-items: center;
  backface-visibility: hidden;
  display: flex;
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  transition: z-index 600ms;
  width: 100%;

  & > div {
    flex: 1;
  }
`

const Back = styled(Front)`
  transform: rotateY(180deg) translateZ(1px);
`

const Inner = styled.div<{ $isFlipped: CardFlipProps['isFlipped'] }>`
  height: 100%;
  position: relative;
  transform: rotateY(${({ $isFlipped }) => ($isFlipped ? 180 : 0)}deg);
  transform-style: preserve-3d;
  transition: transform 600ms;

  ${Front} {
    z-index: ${({ $isFlipped }) => ($isFlipped ? 5 : 10)};
  }

  ${Back} {
    z-index: ${({ $isFlipped }) => ($isFlipped ? 10 : 5)};
  }
`

const StyledCardFlip = styled.div`
  perspective: 1000px;
  z-index: auto;
`

const getComponents = (children: CardFlipProps['children']) => {
  if (children.length !== 2) {
    throw new Error('CardFlip: Two children are required')
  }

  return children
}

const CardFlip: React.FC<React.PropsWithChildren<CardFlipProps>> = ({ isFlipped, height, children }) => {
  const [front, back] = getComponents(children)

  return (
    <StyledCardFlip style={{ height }}>
      <Inner $isFlipped={isFlipped}>
        <Front>{front}</Front>
        <Back>{back}</Back>
      </Inner>
    </StyledCardFlip>
  )
}

export default CardFlip
