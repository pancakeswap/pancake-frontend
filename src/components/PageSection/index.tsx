import { useMemo } from 'react'
import styled from 'styled-components'
import { BoxProps, Box, Flex, FlexProps } from '@pancakeswap/uikit'
import Container from 'components/Layout/Container'
import CurvedDivider from './CurvedDivider'
import { ClipFill, DividerFill } from './types'

interface PageSectionProps extends BackgroundColorProps {
  svgFill?: string
  dividerComponent?: React.ReactNode
  hasCurvedDivider?: boolean
  dividerPosition?: 'top' | 'bottom'
  concaveDivider?: boolean
  containerProps?: BoxProps
  innerProps?: BoxProps
  clipFill?: ClipFill
  dividerFill?: DividerFill
}

interface BackgroundColorProps extends FlexProps {
  index: number
  background?: string
  padding?: string
}

const BackgroundColor = styled(Flex)<BackgroundColorProps>`
  position: relative;
  flex-direction: column;
  align-items: center;
  z-index: ${({ index }) => index - 1};
  background: ${({ background, theme }) => background || theme.colors.background};
  padding: ${({ padding }) => padding};
`

const ChildrenWrapper = styled(Container)`
  min-height: auto;
  padding-top: 16px;
  padding-bottom: 16px;

  ${({ theme }) => theme.mediaQueries.sm} {
    padding-top: 32px;
    padding-bottom: 32px;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    padding-top: 48px;
    padding-bottom: 48px;
  }
`

const PageSection: React.FC<React.PropsWithChildren<PageSectionProps>> = ({
  children,
  background,
  svgFill,
  index = 1,
  dividerComponent,
  dividerPosition = 'bottom',
  hasCurvedDivider = true,
  concaveDivider = false,
  clipFill,
  dividerFill,
  containerProps,
  innerProps,
  ...props
}) => {
  const padding = useMemo(() => {
    // No curved divider
    if (!hasCurvedDivider) {
      return '48px 0'
    }
    // Bottom curved divider
    // Less bottom padding, as the divider is present there
    if (dividerPosition === 'bottom') {
      return '48px 0 14px'
    }
    // Top curved divider
    // Less top padding, as the divider is present there
    if (dividerPosition === 'top') {
      return '14px 0 48px'
    }
    return '48px 0'
  }, [dividerPosition, hasCurvedDivider])

  return (
    <Box {...containerProps}>
      {hasCurvedDivider && dividerPosition === 'top' && (
        <CurvedDivider
          svgFill={svgFill}
          index={index}
          concave={concaveDivider}
          dividerPosition={dividerPosition}
          dividerComponent={dividerComponent}
          clipFill={clipFill}
          dividerFill={dividerFill}
        />
      )}
      <BackgroundColor background={background} index={index} padding={padding} {...props}>
        <ChildrenWrapper {...innerProps}>{children}</ChildrenWrapper>
      </BackgroundColor>
      {hasCurvedDivider && dividerPosition === 'bottom' && (
        <CurvedDivider
          svgFill={svgFill}
          index={index}
          concave={concaveDivider}
          dividerPosition={dividerPosition}
          dividerComponent={dividerComponent}
          clipFill={clipFill}
          dividerFill={dividerFill}
        />
      )}
    </Box>
  )
}

export default PageSection
