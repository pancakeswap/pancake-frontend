import React from 'react'
import styled from 'styled-components'
import { CurvedSvgTop, CurvedSvgBottom } from './svg/CurvedSvg'

interface CurvedDividerProps extends WrapperProps {
  svgFill?: string
  dividerComponent?: React.ReactNode
}
interface WrapperProps {
  index: number
  curvePosition?: 'top' | 'bottom'
}

const Wrapper = styled.div<WrapperProps>`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  z-index: ${({ index }) => index};
  margin: ${({ curvePosition }) => (curvePosition === 'top' ? '-32px' : '32px')} 0 0;
  ${({ theme }) => theme.mediaQueries.sm} {
    margin: ${({ curvePosition }) => (curvePosition === 'top' ? '-40px' : '40px')} 0 0;
  }
`

const ComponentWrapper = styled.div<{ index: number }>`
  z-index: ${({ index }) => index + 1};
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`

const CurvedDivider: React.FC<CurvedDividerProps> = ({ svgFill, index, curvePosition, dividerComponent }) => {
  return (
    <Wrapper index={index} curvePosition={curvePosition}>
      {dividerComponent && <ComponentWrapper index={index}>{dividerComponent}</ComponentWrapper>}
      {curvePosition === 'top' ? (
        <CurvedSvgTop svgFill={svgFill} width="100%" />
      ) : (
        <CurvedSvgBottom svgFill={svgFill} width="100%" />
      )}
    </Wrapper>
  )
}

export default CurvedDivider
