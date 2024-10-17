import { Box, FlexGapProps, MotionBox, MotionFlexGap, useMatchBreakpoints } from '@pancakeswap/uikit'
import { Children, cloneElement, ReactElement } from 'react'
import styled from 'styled-components'

interface MotionTabsProps extends FlexGapProps {
  children: React.ReactElement[]
  activeIndex?: number
  onItemClick?: (index: number) => void

  /** Default: true */
  animateOnMobile?: boolean
}

const MotionBoxUnderline = styled(MotionBox)`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: ${({ theme }) => theme.colors.primary};
  width: 100%;
  border-radius: 2px 2px 0 0;
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
  animateOnMobile = true,
  ...props
}) => {
  const { isMobile } = useMatchBreakpoints()
  return (
    <MotionFlexGap gap={isMobile ? '8px' : '12px'} alignItems="baseline" {...props}>
      {Children.map(children, (child: ReactElement, index) => {
        const isActive = activeIndex === index
        const color = isActive ? 'text' : 'textSubtle'

        return (
          // TODO: Fix not clickable by pressing enter/space when in tab focus
          <StyledTab
            position="relative"
            width="fit-content"
            tabIndex={0}
            onClick={onItemClick ? () => onItemClick(index) : undefined}
          >
            <Box px={['8px', '12px']} py="8px">
              {cloneElement(child, {
                color,
                bold: isActive,
                isactive: isActive,
              })}
            </Box>
            {isActive && <MotionBoxUnderline {...(!(isMobile && !animateOnMobile) && { layoutId: 'underline' })} />}
          </StyledTab>
        )
      })}
    </MotionFlexGap>
  )
}
