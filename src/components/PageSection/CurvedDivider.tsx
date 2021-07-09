import React from 'react'
import styled from 'styled-components'
import { CurvedSvgTop, CurvedSvgBottom, ConcaveTop, ConcaveBottom, ConcaveProps } from './svg/CurvedSvg'

interface CurvedDividerProps extends WrapperProps, ConcaveProps {
  svgFill?: string
  dividerComponent?: React.ReactNode
  curvePosition?: 'top' | 'bottom'
  concave?: boolean
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

const CurvedDivider: React.FC<CurvedDividerProps> = ({
  svgFill,
  index,
  curvePosition,
  dividerComponent,
  concave,
  concaveBackgroundDark,
  concaveBackgroundLight,
}) => {
  const showTopDivider = curvePosition === 'top' && !concave
  const showBottomDivider = curvePosition === 'bottom' && !concave
  const showConcaveTopDivider = curvePosition === 'top' && concave
  const showConcaveBottomDivider = curvePosition === 'bottom' && concave
  return (
    <Wrapper index={index}>
      {dividerComponent && <ComponentWrapper index={index}>{dividerComponent}</ComponentWrapper>}
      {showConcaveTopDivider && (
        <ConcaveTop concaveBackgroundDark={concaveBackgroundDark} concaveBackgroundLight={concaveBackgroundLight} />
      )}
      {showConcaveBottomDivider && (
        <ConcaveBottom concaveBackgroundDark={concaveBackgroundDark} concaveBackgroundLight={concaveBackgroundLight} />
      )}
      {showTopDivider && <CurvedSvgTop svgFill={svgFill} width="100%" />}
      {showBottomDivider && <CurvedSvgBottom svgFill={svgFill} width="100%" />}
    </Wrapper>
  )
}

export default CurvedDivider
