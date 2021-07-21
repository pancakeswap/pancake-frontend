import React from 'react'
import styled from 'styled-components'
import { ConcaveTop, ConcaveBottom, ConvexTop, ConvexBottom, ConcaveProps } from './svg/CurvedSvg'
import { DividerFill } from './types'

interface CurvedDividerProps extends WrapperProps, ConcaveProps {
  svgFill?: string
  dividerComponent?: React.ReactNode
  curvePosition?: 'top' | 'bottom'
  concave?: boolean
}
interface WrapperProps {
  index: number
  dividerFill?: DividerFill
}

const Wrapper = styled.div<WrapperProps>`
  background: ${({ theme, dividerFill }) => {
    if (theme.isDark) {
      return dividerFill?.dark || dividerFill?.light || 'none'
    }
    return dividerFill?.light || dividerFill?.dark || 'none'
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
  index,
  curvePosition,
  dividerComponent,
  concave,
  clipFill,
  dividerFill,
}) => {
  const showTopDivider = curvePosition === 'top' && !concave
  const showBottomDivider = curvePosition === 'bottom' && !concave
  const showConcaveTopDivider = curvePosition === 'top' && concave
  const showConcaveBottomDivider = curvePosition === 'bottom' && concave

  const getConcaveDivider = () => {
    return (
      <>
        {showConcaveTopDivider && <ConcaveTop clipFill={clipFill} />}
        {showConcaveBottomDivider && <ConcaveBottom clipFill={clipFill} />}
      </>
    )
  }

  const getConvexDivider = () => {
    return (
      <>
        {showTopDivider && <ConvexTop clipFill={clipFill} />}
        {showBottomDivider && <ConvexBottom clipFill={clipFill} />}
      </>
    )
  }

  return (
    <Wrapper index={index} dividerFill={dividerFill}>
      {dividerComponent && <ComponentWrapper index={index}>{dividerComponent}</ComponentWrapper>}
      {getConcaveDivider()}
      {getConvexDivider()}
    </Wrapper>
  )
}

export default CurvedDivider
