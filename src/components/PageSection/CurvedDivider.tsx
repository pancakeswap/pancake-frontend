import React from 'react'
import styled from 'styled-components'
import { CurvedSvgTop, CurvedSvgBottom } from './svg/CurvedSvg'

interface CurvedDividerProps extends WrapperProps {
  svgFill?: string
  dividerComponent?: React.ReactNode
  curvePosition?: 'top' | 'bottom'
}
interface WrapperProps {
  index: number
}

const Wrapper = styled.div<WrapperProps>`
  z-index: ${({ index }) => index};
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
`

const ComponentWrapper = styled.div<WrapperProps>`
  z-index: ${({ index }) => index + 1};
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`

const CurvedDivider: React.FC<CurvedDividerProps> = ({ svgFill, index, curvePosition, dividerComponent }) => {
  return (
    <Wrapper index={index}>
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
