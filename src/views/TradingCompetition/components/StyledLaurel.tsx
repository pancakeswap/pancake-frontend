import styled from 'styled-components'
import { Laurel } from '../svgs'

const StyledLaurel = styled(Laurel)<{ dir?: 'l' | 'r' }>`
  ${({ dir }) =>
    dir === 'l'
      ? `
  transform: scaleX(-1);
  margin-right: 8px;
  `
      : 'margin-left: 8px;'}
`

export default StyledLaurel
