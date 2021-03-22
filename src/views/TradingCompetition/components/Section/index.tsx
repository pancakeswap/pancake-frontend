import React from 'react'
import styled from 'styled-components'
import { Flex } from '@pancakeswap-libs/uikit'
import { SectionProps } from '../../types'
import IntersectionCurve from './IntersectionCurve'

const BackgroundColorWrapper = styled(Flex)<SectionProps>`
  position: relative;
  flex-direction: column;
  z-index: ${({ index }) => index};
  background: ${({ backgroundStyle }) => backgroundStyle};

  padding-top: ${({ intersectionPosition }) => (intersectionPosition === 'top' ? '6px' : '48px')};
  margin: ${({ intersectionPosition }) => (intersectionPosition === 'top' ? '0' : '-34px')} 0;

  ${({ theme }) => theme.mediaQueries.sm} {
    margin: ${({ intersectionPosition }) => (intersectionPosition === 'top' ? '0' : '-42px')} 0;
  }
`

const ChildrenWrapper = styled.div`
  margin-left: auto;
  margin-right: auto;
  max-width: 1200px;
  padding: 16px;

  ${({ theme }) => theme.mediaQueries.sm} {
    padding: 24px;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    padding-top: 32px;
    padding-bottom: 32px;
  }
`

const Section: React.FC<SectionProps> = ({
  children,
  backgroundStyle = '#faf9fa',
  svgFill = '#faf9fa',
  index = 1,
  intersectComponent,
  intersectionPosition = 'bottom',
}) => {
  return (
    <>
      {intersectionPosition === 'top' && (
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
      >
        <ChildrenWrapper>{children}</ChildrenWrapper>
      </BackgroundColorWrapper>
      {intersectionPosition === 'bottom' && (
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
