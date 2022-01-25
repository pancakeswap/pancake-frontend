import React from 'react'
import styled from 'styled-components'
import { ConcaveTop, ConcaveBottom, ConvexTop, ConvexBottom } from './svg/CurvedSvg'
import { DividerFill, ClipFill } from './types'

interface CurvedDividerProps extends WrapperProps {
  svgFill?: string
  dividerComponent?: React.ReactNode
  dividerPosition?: 'top' | 'bottom'
  concave?: boolean
  clipFill?: ClipFill
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
  dividerPosition,
  dividerComponent,
  concave,
  clipFill,
  dividerFill,
}) => {
  const showConvexTop = dividerPosition === 'top' && !concave
  const showConvexBottom = dividerPosition === 'bottom' && !concave
  const showConcaveTop = dividerPosition === 'top' && concave
  const showConcaveBottom = dividerPosition === 'bottom' && concave

  const getConcaveDivider = () => {
    return (
      <>
        {showConcaveTop && <ConcaveTop clipFill={clipFill} />}
        {showConcaveBottom && <ConcaveBottom clipFill={clipFill} />}
      </>
    )
  }

  const getConvexDivider = () => {
    return (
      <>
        {showConvexTop && <ConvexTop clipFill={clipFill} />}
        {showConvexBottom && <ConvexBottom clipFill={clipFill} />}
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
