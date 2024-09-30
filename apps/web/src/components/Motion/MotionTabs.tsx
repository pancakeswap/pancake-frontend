import { Box, MotionBox, MotionFlexGap, useMatchBreakpoints } from '@pancakeswap/uikit'
import { Children, cloneElement, ReactElement } from 'react'
import styled from 'styled-components'

interface MotionTabsProps {
  children: React.ReactElement[]
  activeIndex?: number
  onItemClick?: (index: number) => void
}

const MotionBoxUnderline = styled(MotionBox)`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: ${({ theme }) => theme.colors.primary};
  width: 100%;
`

const StyledTab = styled(Box)`
  cursor: pointer;
  user-select: none;
  transition: all 0.25s;
`

export const MotionTabs: React.FC<React.PropsWithChildren<MotionTabsProps>> = ({
  children,
  onItemClick,
  activeIndex = 0,
}) => {
  const { isMobile } = useMatchBreakpoints()
  return (
    <MotionFlexGap gap={isMobile ? '8px' : '12px'} alignItems="baseline">
      {Children.map(children, (child: ReactElement, index) => {
        const isActive = activeIndex === index
        const color = isActive ? 'text' : 'textSubtle'

        return (
          <>
            <StyledTab position="relative" width="fit-content">
              <Box px={['8px', '12px']} py="8px">
                {cloneElement(child, {
                  onClick: onItemClick ? () => onItemClick(index) : undefined,
                  color,
                  bold: isActive,
                  isActive,
                })}
              </Box>
              {isActive && <MotionBoxUnderline layoutId="underline" />}
            </StyledTab>
          </>
        )
      })}
    </MotionFlexGap>
  )
}
