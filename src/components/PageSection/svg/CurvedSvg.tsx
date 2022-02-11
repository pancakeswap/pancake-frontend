import React from 'react'
import styled, { css, DefaultTheme } from 'styled-components'
import { Box } from '@tovaswapui/uikit'
import { ClipFill } from '../types'

interface CurveProps {
  clipFill?: ClipFill
}

interface ContainerProps extends CurveProps {
  clipPath: string
}

const sharedStyles = (theme: DefaultTheme, clipPath: string, clipFill?: ClipFill) => css`
  width: 100%;
  height: 20px;
  clip-path: url(${clipPath});

  background: ${() => {
    if (theme.isDark) {
      return clipFill?.dark || clipFill?.light || theme.colors.background
    }
    return clipFill?.light || theme.colors.background
  }};

  & svg {
    display: block;
  }
`

const ConcaveContainer = styled(Box)<ContainerProps>`
  ${({ theme, clipPath, clipFill }) => sharedStyles(theme, clipPath, clipFill)}
  transform: ${({ clipPath }) => (clipPath === '#bottomConcaveCurve' ? 'translate(0, -13px)' : 'translate(0, 1px)')};
`

const ConvexContainer = styled(Box)<ContainerProps>`
  ${({ theme, clipPath, clipFill }) => sharedStyles(theme, clipPath, clipFill)}
  transform: ${({ clipPath }) => (clipPath === '#bottomConvexCurve' ? 'translate(0, -13px)' : 'translate(0, -1px)')};
`

export const ConvexTop: React.FC<CurveProps> = ({ clipFill }) => (
  <ConvexContainer clipFill={clipFill} clipPath="#topConvexCurve">
    <svg width="0" height="0">
      <defs>
        <clipPath id="topConvexCurve" clipPathUnits="objectBoundingBox">
          <path d="M 0,1 L 0,0 L 1,0 L 1,1 C 0.75 0, .25 0, 0 1 Z" />
        </clipPath>
      </defs>
    </svg>
  </ConvexContainer>
)

export const ConvexBottom: React.FC<CurveProps> = ({ clipFill }) => (
  <ConvexContainer clipFill={clipFill} clipPath="#bottomConvexCurve">
    <svg width="0" height="0">
      <defs>
        <clipPath id="bottomConvexCurve" clipPathUnits="objectBoundingBox">
          <path d="M 0,0 L 0,1 L 1,1 L 1,0 C .75 1, .25 1, 0 0 Z" />
        </clipPath>
      </defs>
    </svg>
  </ConvexContainer>
)

export const ConcaveTop: React.FC<CurveProps> = ({ clipFill }) => (
  <ConcaveContainer clipFill={clipFill} clipPath="#topConcaveCurve">
    <svg width="0" height="0">
      <defs>
        <clipPath id="topConcaveCurve" clipPathUnits="objectBoundingBox">
          <path d="M 0,0 L 0,1 L 1,1 L 1,0 C .75 1, .25 1, 0 0 Z" />
        </clipPath>
      </defs>
    </svg>
  </ConcaveContainer>
)

export const ConcaveBottom: React.FC<CurveProps> = ({ clipFill }) => (
  <ConcaveContainer clipFill={clipFill} clipPath="#bottomConcaveCurve">
    <svg width="0" height="0">
      <defs>
        <clipPath id="bottomConcaveCurve" clipPathUnits="objectBoundingBox">
          <path d="M 0,1 L 0,0 L 1,0 L 1,1 C .75 0.1, .25 0.1, 0 1 Z" />
        </clipPath>
      </defs>
    </svg>
  </ConcaveContainer>
)
