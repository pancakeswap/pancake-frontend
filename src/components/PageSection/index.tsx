import React from 'react'
import styled from 'styled-components'
import { BoxProps, Box, Flex, FlexProps } from '@pancakeswap/uikit'
import Container from 'components/Layout/Container'
import CurvedDivider from './CurvedDivider'
import { ConcaveProps } from './svg/CurvedSvg'

interface PageSectionProps extends BackgroundColorProps, ConcaveProps {
  svgFill?: string
  dividerComponent?: React.ReactNode
  hasCurvedDivider?: boolean
  curvePosition?: 'top' | 'bottom'
  concaveDivider?: boolean
  containerProps?: BoxProps
  innerProps?: BoxProps
}

interface BackgroundColorProps extends FlexProps {
  index: number
  background?: string
}

const BackgroundColor = styled(Flex)<BackgroundColorProps>`
  position: relative;
  flex-direction: column;
  align-items: center;
  z-index: ${({ index }) => index - 1};
  background: ${({ background, theme }) => background || theme.colors.background};
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

const PageSection: React.FC<PageSectionProps> = ({
  children,
  background,
  svgFill,
  index = 1,
  dividerComponent,
  curvePosition = 'bottom',
  hasCurvedDivider = true,
  concaveDivider = false,
  concaveBackgroundDark,
  concaveBackgroundLight,
  containerProps,
  innerProps,
  ...props
}) => {
  const getPadding = () => {
    // No curved divider
    if (!hasCurvedDivider) {
      return '48px 0'
    }
    // Bottom curved divider
    // Less bottom padding, as the divider is present there
    if (curvePosition === 'bottom') {
      return '48px 0 14px'
    }
    // Top curved divider
    // Less top padding, as the divider is present there
    if (curvePosition === 'top') {
      return '14px 0 48px'
    }
    return '48px 0'
  }

  return (
    <Box {...containerProps}>
      {hasCurvedDivider && curvePosition === 'top' && (
        <CurvedDivider
          svgFill={svgFill}
          index={index}
          concave={concaveDivider}
          curvePosition={curvePosition}
          dividerComponent={dividerComponent}
          concaveBackgroundDark={concaveBackgroundDark}
          concaveBackgroundLight={concaveBackgroundLight}
        />
      )}
      <BackgroundColor background={background} index={index} p={getPadding()} {...props}>
        <ChildrenWrapper {...innerProps}>{children}</ChildrenWrapper>
      </BackgroundColor>
      {hasCurvedDivider && curvePosition === 'bottom' && (
        <CurvedDivider
          svgFill={svgFill}
          index={index}
          concave={concaveDivider}
          curvePosition={curvePosition}
          dividerComponent={dividerComponent}
          concaveBackgroundDark={concaveBackgroundDark}
          concaveBackgroundLight={concaveBackgroundLight}
        />
      )}
    </Box>
  )
}

export default PageSection
