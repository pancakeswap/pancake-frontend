import styled from 'styled-components'
import { Svg, SvgProps } from '@pancakeswap/uikit'

export const OuterWedgeWrapper = styled.div`
  z-index: -1;
  overflow: hidden;
  position: absolute;
  width: 100%;
  height: 100%;
  right: 0px;
  top: 0px;
`

export const InnerWedgeWrapper = styled.div<{ fill: string; top?: boolean; width?: string }>`
  position: absolute;
  display: flex;
  width: 100%;
  ${({ top }) => (top ? 'top: 0px' : 'bottom: 0px')};

  svg {
    fill: ${({ fill }) => fill};
    width: ${({ width }) => width || '100%'};
    height: 100%;
    max-height: 48px;
  }
`

export const WedgeTopLeft: React.FC<SvgProps> = (props) => {
  return (
    <Svg viewBox="0 0 1660 48" {...props} preserveAspectRatio="none">
      <path d="M1660 48C1139.02 46.1887 336.256 15.2453 0 0H1660V48Z" />
    </Svg>
  )
}

export const WedgeTopRight: React.FC<SvgProps> = (props) => {
  return (
    <Svg viewBox="0 0 1660 48" {...props} preserveAspectRatio="none">
      <path d="M-346 48C174.985 46.1887 977.744 15.2453 1314 0H-346V48Z" />
    </Svg>
  )
}

export const WedgeBottomRight: React.FC<SvgProps> = (props) => {
  return (
    <Svg viewBox="0 0 1660 48" {...props} preserveAspectRatio="none">
      <path d="M0 0C520.985 1.81132 1323.74 32.7547 1660 48H0V0Z" />
    </Svg>
  )
}

export const WedgeBottomLeft: React.FC<SvgProps> = (props) => {
  return (
    <Svg viewBox="0 0 1660 48" {...props} preserveAspectRatio="none">
      <path d="M1660 0C1139.02 1.81132 336.256 32.7547 0 48H1660V0Z" />
    </Svg>
  )
}
