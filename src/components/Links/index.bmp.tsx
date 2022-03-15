import styled from 'styled-components'
import React from 'react'

const StyledInternalLink = styled('a')`
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

const InternalLink = ({ children, ...props }) => {
  return <StyledInternalLink {...props}>{children}</StyledInternalLink>
}

export default InternalLink
