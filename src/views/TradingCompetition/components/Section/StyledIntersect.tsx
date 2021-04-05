import styled from 'styled-components'
import { Intersect } from '../../svgs'
import { SectionProps } from '../../types'

const sharedStyles = `
svg {
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  }
`

export const TopIntersectSvg = styled(Intersect)<SectionProps>`
  ${sharedStyles}
  transform: rotate(180deg);
  margin-bottom: -2px;
  fill: ${({ svgFill, theme }) => (!svgFill ? theme.colors.background : svgFill)};
`

export const BottomIntersectSvg = styled(Intersect)<SectionProps>`
  ${sharedStyles}
  fill: ${({ svgFill, theme }) => (!svgFill ? theme.colors.background : svgFill)};
`
