import React from 'react'
import styled from 'styled-components'
import { Flex, FlexProps } from '@pancakeswap/uikit'
import Container from 'components/layout/Container'
import CurvedDivider from './CurvedDivider'

interface PageSectionProps extends BackgroundColorProps {
  svgFill?: string
  dividerComponent?: React.ReactNode
  hasCurvedDivider?: boolean
  curvePosition?: 'top' | 'bottom'
}

interface BackgroundColorProps extends FlexProps {
  index: number
  background?: string
  hasZeroMargin?: boolean
  padding?: string
}

const BackgroundColor = styled(Flex)<BackgroundColorProps>`
  position: relative;
  flex-direction: column;
  z-index: ${({ index }) => index - 1};
  background: ${({ background, theme }) => background || theme.colors.background};
  padding: ${({ padding }) => padding};
  margin: ${({ hasZeroMargin }) => (hasZeroMargin ? '0' : '-32px 0')};
  ${({ theme }) => theme.mediaQueries.sm} {
    margin: ${({ hasZeroMargin }) => (hasZeroMargin ? '0' : '-52px 0')};
  }
  @media screen and (min-width: 1920px) {
    margin: ${({ hasZeroMargin }) => (hasZeroMargin ? '0' : '-72px 0')};
  }
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
  ...props
}) => {
  const hasZeroMargin = !hasCurvedDivider || curvePosition === 'top'

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
    <>
      {hasCurvedDivider && curvePosition === 'top' && (
        <CurvedDivider
          svgFill={svgFill}
          index={index}
          curvePosition={curvePosition}
          dividerComponent={dividerComponent}
        />
      )}
      <BackgroundColor
        background={background}
        index={index}
        padding={getPadding()}
        hasZeroMargin={hasZeroMargin}
        {...props}
      >
        <ChildrenWrapper>{children}</ChildrenWrapper>
      </BackgroundColor>
      {hasCurvedDivider && curvePosition === 'bottom' && (
        <CurvedDivider
          svgFill={svgFill}
          index={index}
          curvePosition={curvePosition}
          dividerComponent={dividerComponent}
        />
      )}
    </>
  )
}

export default PageSection
