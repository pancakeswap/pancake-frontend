import styled from 'styled-components'
import { Laurel } from '../svgs'

interface LaurelProps {
  dir?: 'l' | 'r'
  fillColor?: string
}

const StyledLaurel = styled(Laurel)<LaurelProps>`
  path {
    fill: ${({ fillColor }) => fillColor || '#27262c'};
  }

  ${({ dir }) =>
    dir === 'l'
      ? `
  transform: scaleX(-1);
  margin-right: 8px;
  `
      : 'margin-left: 8px;'}
`

export default StyledLaurel
