import React from 'react'
import styled from 'styled-components'
import {
  CurvedSvgTop,
  CurvedSvgBottom,
  ConcaveTop,
  ConcaveBottom,
  ConvexTop,
  ConvexBottom,
  ConcaveProps,
} from './svg/CurvedSvg'

interface CurvedDividerProps extends WrapperProps, ConcaveProps {
  svgFill?: string
  dividerComponent?: React.ReactNode
  curvePosition?: 'top' | 'bottom'
  concave?: boolean
}
interface WrapperProps {
  index: number
  curveFillLight?: string
  curveFillDark?: string
}

const Wrapper = styled.div<WrapperProps>`
  background-color: ${({ theme, curveFillLight, curveFillDark }) => {
    if (theme.isDark) {
      return curveFillDark || curveFillLight || '#66578D'
    }
    return curveFillLight || curveFillDark || '#9A9FD0'
  }};
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
  curveFillDark,
  curveFillLight,
}) => {
  const showTopDivider = curvePosition === 'top' && !concave
  const showBottomDivider = curvePosition === 'bottom' && !concave
  const showConcaveTopDivider = curvePosition === 'top' && concave
  const showConcaveBottomDivider = curvePosition === 'bottom' && concave

  const getConcaveDivider = () => {
    return (
      <>
        {showConcaveTopDivider && (
          <ConcaveTop concaveBackgroundDark={concaveBackgroundDark} concaveBackgroundLight={concaveBackgroundLight} />
        )}
        {showConcaveBottomDivider && (
          <ConcaveBottom
            concaveBackgroundDark={concaveBackgroundDark}
            concaveBackgroundLight={concaveBackgroundLight}
          />
        )}
      </>
    )
  }

  const getConvexDivider = () => {
    return (
      <>
        {showTopDivider && (
          <ConvexTop concaveBackgroundDark={concaveBackgroundDark} concaveBackgroundLight={concaveBackgroundLight} />
        )}
        {showBottomDivider && (
          <ConvexBottom concaveBackgroundDark={concaveBackgroundDark} concaveBackgroundLight={concaveBackgroundLight} />
        )}
      </>
    )
  }

  return (
    <Wrapper index={index} curveFillDark={curveFillDark} curveFillLight={curveFillLight}>
      {dividerComponent && <ComponentWrapper index={index}>{dividerComponent}</ComponentWrapper>}
      {getConcaveDivider()}
      {getConvexDivider()}
    </Wrapper>
  )
}

export default CurvedDivider
