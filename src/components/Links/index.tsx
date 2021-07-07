import { Link } from 'react-router-dom'
import styled from 'styled-components'

// An internal link from the react-router-dom library that is correctly styled
const StyledInternalLink = styled(Link)`
  text-decoration: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 500;

  :hover {
    text-decoration: underline;
  }

  :focus {
    outline: none;
    text-decoration: underline;
  }

  :active {
    text-decoration: none;
  }
`

export default StyledInternalLink
