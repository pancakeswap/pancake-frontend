// @ts-nocheck
/**
 * There is ts-nocheck at the top of this file for the following reasons:
 * 1. You can't ignore block in TS at the moment https://stackoverflow.com/questions/51145180/how-to-use-ts-ignore-for-a-block
 * 2. Interpolations in keyframes are indeed supported and work fine https://github.com/styled-components/styled-components/issues/2263
 * But TypeScript definitions are not updated to reflect that - https://github.com/DefinitelyTyped/DefinitelyTyped/issues/48907
 * 3. Since this error is in the middle of a template string there is no way to add @ts-ignore on just that one line
 * without also messing prettier.
 *
 * I'll leave TODO: comment here to check back later if there is update to types
 *
 */
import styled, { keyframes } from 'styled-components'

interface SliceProps {
  length: number
  offset?: number
}

export const DrawAnimation = keyframes`
  from {
    stroke-dasharray: 0, 339.292
  }
  to {
    stroke-dasharray: ${({ length }: SliceProps) => length} 339.292;
  }
`

export const OffsetAnimation = keyframes`
  from {
    stroke-dashoffset: 0
  }
  to {
    stroke-dashoffset: ${(props) => -props.offset};
  }
`

export const SVG = styled.svg`
  width: 128px;
  height: 128px;
  transform: rotate(-90deg);
`

const DefaultSlice = styled.circle<SliceProps>`
  fill: none;
  stroke-width: 16;
  stroke-dasharray: ${(props) => `${props.length} 339.292`};
`

export const LostSlice = styled(DefaultSlice)`
  stroke: #ed4b9e;
  animation: ${DrawAnimation} 1s ease;
`

export const WonSlice = styled(DefaultSlice)`
  stroke: #31d0aa;
  stroke-dashoffset: ${(props) => -props.offset};
  animation: ${DrawAnimation} 1s ease, ${OffsetAnimation} 1s ease;
`

export const Wrapper = styled.div`
  position: relative;
  width: 128px;
  height: 128px;
`

export const Info = styled.div`
  width: 128px;
  height: 128px;
  border-radius: 50%;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 2;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`
