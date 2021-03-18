import styled from 'styled-components'
import { ReactComponent as LaurelSvg } from '../svgs/laurel.svg'

interface LaurelProps {
  dir?: string
  fillColor?: string
}

const Laurel = styled(LaurelSvg)<LaurelProps>`
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

export default Laurel
