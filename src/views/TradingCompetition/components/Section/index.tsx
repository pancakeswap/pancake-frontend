import React from 'react'
import styled from 'styled-components'
import { Flex } from '@pancakeswap-libs/uikit'
import { TopIntersect, BottomIntersect } from './StyledIntersect'

interface SectionProps {
  backgroundStyle?: string
  svgFill?: string
  index?: number
  intersectionPosition?: 'top' | 'bottom'
  intersectComponent?: React.ReactNode
}

const BackgroundColorWrapper = styled(Flex)<SectionProps>`
  position: relative;
  flex-direction: column;
  z-index: -${({ index }) => index};
  background: ${({ backgroundStyle }) => backgroundStyle};

  padding-top: ${({ intersectionPosition }) => (intersectionPosition === 'top' ? '6px' : '48px')};
  margin: ${({ intersectionPosition }) => (intersectionPosition === 'top' ? '0' : '-34px')} -16px;

  ${({ theme }) => theme.mediaQueries.sm} {
    margin: ${({ intersectionPosition }) => (intersectionPosition === 'top' ? '0' : '-42px')} -24px;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
  }
`

const IntersectWrapper = styled.div<SectionProps>`
  position: relative;
  display: flex;
  align-items: center;
  width: calc(100% + 48px);
  z-index: -${({ index }) => index};

  svg {
    fill: ${({ svgFill }) => svgFill};
    z-index: -${({ index }) => index};
  }
  margin: ${({ intersectionPosition }) => (intersectionPosition === 'top' ? '-33px' : '33px')} -16px 0;

  ${({ theme }) => theme.mediaQueries.sm} {
    margin: ${({ intersectionPosition }) => (intersectionPosition === 'top' ? '-41px' : '41px')} -24px 0;
  }
`

const IntersectComponentWrapper = styled.div`
  width: 100%;
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 5;
  transform: translate(-50%, -50%);
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
        <IntersectWrapper svgFill={svgFill} index={index} intersectionPosition={intersectionPosition}>
          {intersectComponent && <IntersectComponentWrapper>{intersectComponent}</IntersectComponentWrapper>}
          <TopIntersect width="100%" />
        </IntersectWrapper>
      )}
      <BackgroundColorWrapper
        backgroundStyle={backgroundStyle}
        index={index}
        intersectionPosition={intersectionPosition}
      >
        {children}
      </BackgroundColorWrapper>
      {intersectionPosition === 'bottom' && (
        <IntersectWrapper svgFill={svgFill} index={index}>
          {intersectComponent && <IntersectComponentWrapper>{intersectComponent}</IntersectComponentWrapper>}
          <BottomIntersect width="100%" />
        </IntersectWrapper>
      )}
    </>
  )
}

export default Section
