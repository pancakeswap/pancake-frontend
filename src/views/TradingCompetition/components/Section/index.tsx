import React from 'react'
import styled from 'styled-components'
import { Flex } from '@pancakeswap/uikit'
import Page from 'components/layout/Page'
import { SectionProps } from '../../types'
import IntersectionCurve from './IntersectionCurve'

const BackgroundColorWrapper = styled(Flex)<SectionProps>`
  position: relative;
  flex-direction: column;
  z-index: ${({ index }) => index - 1};
  background: ${({ backgroundStyle, theme }) => (!backgroundStyle ? theme.colors.background : backgroundStyle)};
  padding: ${({ noIntersection }) => (noIntersection ? '96px 0 24px 0' : '48px 0;')};
  margin: ${({ intersectionPosition }) => (intersectionPosition === 'top' ? '0' : '-34px')} 0;

  ${({ theme }) => theme.mediaQueries.sm} {
    margin: ${({ intersectionPosition }) => (intersectionPosition === 'top' ? '0' : '-42px')} 0;
  }

  ${({ theme }) => theme.mediaQueries.xl} {
    margin: ${({ intersectionPosition }) => (intersectionPosition === 'top' ? '0' : '-52px')} 0;
  }

  @media screen and (min-width: 1920px) {
    margin: ${({ intersectionPosition }) => (intersectionPosition === 'top' ? '0' : '-72px')} 0;
  }
`

const ChildrenWrapper = styled(Page)`
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

const Section: React.FC<SectionProps> = ({
  children,
  backgroundStyle,
  svgFill,
  index = 1,
  intersectComponent,
  intersectionPosition = 'bottom',
  noIntersection = false,
}) => {
  return (
    <>
      {!noIntersection && intersectionPosition === 'top' && (
        <IntersectionCurve
          svgFill={svgFill}
          index={index}
          intersectionPosition={intersectionPosition}
          intersectComponent={intersectComponent}
        />
      )}
      <BackgroundColorWrapper
        backgroundStyle={backgroundStyle}
        index={index}
        intersectionPosition={intersectionPosition}
        intersectComponent={intersectComponent}
        noIntersection={noIntersection}
      >
        <ChildrenWrapper>{children}</ChildrenWrapper>
      </BackgroundColorWrapper>
      {!noIntersection && intersectionPosition === 'bottom' && (
        <IntersectionCurve
          svgFill={svgFill}
          index={index}
          intersectionPosition={intersectionPosition}
          intersectComponent={intersectComponent}
        />
      )}
    </>
  )
}

export default Section
