import { BoxProps, Flex, MotionBox } from '@pancakeswap/uikit'
import { useMemo } from 'react'
import styled from 'styled-components'

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

interface TabContentProps extends BoxProps {
  children?: React.ReactNode
  type?: 'default' | 'to_right'
}

export const TabContent = ({ children, type = 'default', ...props }: TabContentProps) => {
  const motionBoxConfig = useMemo(
    () => ({
      initial: {
        opacity: 0.2,
        x: type === 'to_right' ? 20 : 0,
      },
      animate: {
        opacity: 1,
        x: 0,
      },
    }),
    [type],
  )

  return (
    <MotionBox {...motionBoxConfig} {...props}>
      <ScrollableContainer>{children}</ScrollableContainer>
    </MotionBox>
  )
}
