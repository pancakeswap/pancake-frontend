import React from 'react'
import styled from 'styled-components'
import { SectionProps } from '../../types'
import { TopIntersectSvg, BottomIntersectSvg } from './StyledIntersect'

const IntersectWrapper = styled.div<SectionProps>`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  z-index: ${({ index }) => index};

  margin: ${({ intersectionPosition }) => (intersectionPosition === 'top' ? '-32px' : '32px')} 0 0;

  ${({ theme }) => theme.mediaQueries.sm} {
    margin: ${({ intersectionPosition }) => (intersectionPosition === 'top' ? '-40px' : '40px')} 0 0;
  }
`

const IntersectComponentWrapper = styled.div<{ index?: number }>`
  z-index: ${({ index }) => index + 1};
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`

const IntersectionCurve: React.FC<SectionProps> = ({ svgFill, index, intersectionPosition, intersectComponent }) => {
  return (
    <IntersectWrapper svgFill={svgFill} index={index} intersectionPosition={intersectionPosition}>
      {intersectComponent && <IntersectComponentWrapper index={index}>{intersectComponent}</IntersectComponentWrapper>}
      {intersectionPosition === 'top' ? (
        <TopIntersectSvg svgFill={svgFill} width="100%" />
      ) : (
        <BottomIntersectSvg svgFill={svgFill} width="100%" />
      )}
    </IntersectWrapper>
  )
}

export default IntersectionCurve
