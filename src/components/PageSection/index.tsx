import React from 'react'
import styled from 'styled-components'
import { Flex } from '@pancakeswap/uikit'
import Container from 'components/layout/Container'
import CurvedDivider from './CurvedDivider'

interface PageSectionProps extends BackgroundColorProps {
  svgFill?: string
  dividerComponent?: React.ReactNode
}

interface BackgroundColorProps {
  index: number
  background?: string
  hasCurvedDivider?: boolean
  curvePosition?: 'top' | 'bottom'
}

const BackgroundColor = styled(Flex)<BackgroundColorProps>`
  position: relative;
  flex-direction: column;
  z-index: ${({ index }) => index - 1};
  background: ${({ background, theme }) => background || theme.colors.background};
  padding: ${({ hasCurvedDivider }) => (hasCurvedDivider ? '48px 0' : '96px 0 24px')};
  margin: ${({ curvePosition }) => (curvePosition === 'top' ? '0' : '-34px')} 0;
  ${({ theme }) => theme.mediaQueries.sm} {
    margin: ${({ curvePosition }) => (curvePosition === 'top' ? '0' : '-42px')} 0;
  }
  ${({ theme }) => theme.mediaQueries.xl} {
    margin: ${({ curvePosition }) => (curvePosition === 'top' ? '0' : '-52px')} 0;
  }
  @media screen and (min-width: 1920px) {
    margin: ${({ curvePosition }) => (curvePosition === 'top' ? '0' : '-72px')} 0;
  }
`

const ChildrenWrapper = styled(Container)`
  min-height: auto;
  padding-top: 16px;
  padding-bottom: 16px;

  ${({ theme }) => theme.mediaQueries.sm} {
    padding-top: 24px;
    padding-bottom: 24px;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    padding-top: 32px;
    padding-bottom: 32px;
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
}) => {
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
        curvePosition={curvePosition}
        hasCurvedDivider={hasCurvedDivider}
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
