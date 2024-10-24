import { Box, BoxProps, Flex } from '@pancakeswap/uikit'
import styled, { css, keyframes } from 'styled-components'

type AnimationType = 'default' | 'to_right'

const ScrollableContainer = styled(Flex)`
  flex-direction: column;
  height: auto;
  ${({ theme }) => theme.mediaQueries.xs} {
    max-height: 90vh;
  }
  ${({ theme }) => theme.mediaQueries.md} {
    max-height: none;
  }
`

const fadeIn = keyframes`
  from {
    opacity: 0.2;
  }
  to {
    opacity: 1;
  }
`

const fadeInFromRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`

const AnimatedBox = styled(Box)<{ $type: AnimationType }>`
  animation: ${({ $type }) =>
    $type === 'to_right'
      ? css`
          ${fadeInFromRight} 0.3s cubic-bezier(.19,.23,.75,1.05)
        `
      : css`
          ${fadeIn} 0.4s ease-out
        `};
`

interface TabContentProps extends BoxProps {
  children?: React.ReactNode
  type?: AnimationType
}

export const TabContent = ({ children, type = 'default', ...props }: TabContentProps) => {
  return (
    <AnimatedBox $type={type} {...props}>
      <ScrollableContainer>{children}</ScrollableContainer>
    </AnimatedBox>
  )
}
