import React from 'react'
import styled from 'styled-components'
import { Flex } from '@pancakeswap-libs/uikit'
import Page from '../../../../components/layout/Page'
import { SectionProps } from '../../types'
import IntersectionCurve from './IntersectionCurve'

const BackgroundColorWrapper = styled(Flex)<SectionProps>`
  position: relative;
  flex-direction: column;
  z-index: ${({ index }) => index - 1};
  background: ${({ backgroundStyle }) => backgroundStyle};
  padding: ${({ noIntersection }) => (noIntersection ? '96px 0 24px 0' : '48px 0;')};
  margin: ${({ intersectionPosition }) => (intersectionPosition === 'top' ? '0' : '-34px')} 0;

  ${({ theme }) => theme.mediaQueries.sm} {
    margin: ${({ intersectionPosition }) => (intersectionPosition === 'top' ? '0' : '-42px')} 0;
  }
`

const ChildrenWrapper = styled(Page)`
  min-height: auto;
`

const Section: React.FC<SectionProps> = ({
  children,
  backgroundStyle = '#faf9fa',
  svgFill = '#faf9fa',
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
