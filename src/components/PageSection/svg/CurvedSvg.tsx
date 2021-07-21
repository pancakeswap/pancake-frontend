import React from 'react'
import styled from 'styled-components'
import { Svg, SvgProps, Box } from '@pancakeswap/uikit'
import { ClipFill } from '../types'

export interface ConcaveProps {
  clipFill?: ClipFill
}

const ConcaveContainer = styled(Box)<{
  clipPath: string
  clipFill?: ClipFill
}>`
  width: 100%;
  height: 20px;
  background: ${({ theme, clipFill }) => {
    if (theme.isDark) {
      return clipFill?.dark || clipFill?.light || '#66578D'
    }
    return clipFill?.light || clipFill?.dark || '#9A9FD0'
  }};
  clip-path: ${({ clipPath }) => `url(${clipPath})`};
  transform: ${({ clipPath }) => (clipPath === '#bottomConcaveCurve' ? 'translate(0, -13px)' : 'translate(0, 1px)')};

  & svg {
    display: block;
  }
`

const ConvexContainer = styled(Box)<{
  clipPath: string
  clipFill?: ClipFill
}>`
  width: 100%;
  height: 20px;
  background: ${({ theme, clipFill }) => {
    if (theme.isDark) {
      return clipFill?.dark || clipFill?.light || '#66578D'
    }
    return clipFill?.light || clipFill?.dark || '#9A9FD0'
  }};
  clip-path: ${({ clipPath }) => `url(${clipPath})`};
  transform: ${({ clipPath }) => (clipPath === '#bottomConvexCurve' ? 'translate(0, -13px)' : 'translate(0, -1px)')};

  & svg {
    display: block;
  }
`

export const ConvexTop: React.FC<ConcaveProps> = ({ clipFill }) => (
  <ConvexContainer clipFill={clipFill} clipPath="#topConvexCurve">
    <svg width="0" height="0">
      <defs>
        <clipPath id="topConvexCurve" clipPathUnits="objectBoundingBox">
          <path d="M 0,1 L 0,0 L 1,0 L 1,1 C 0.75 0, 0.25 0.1, 0 1 Z" />
        </clipPath>
      </defs>
    </svg>
  </ConvexContainer>
)

export const ConvexBottom: React.FC<ConcaveProps> = ({ clipFill }) => (
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

export const ConcaveTop: React.FC<ConcaveProps> = ({ clipFill }) => (
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

export const ConcaveBottom: React.FC<ConcaveProps> = ({ clipFill }) => (
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
