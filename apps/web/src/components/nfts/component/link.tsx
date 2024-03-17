import { styled } from 'styled-components'

const StyledInternalLink = styled('a')`
  text-decoration: none;
  cursor: pointer;
  font-weight: 500;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }

  &:focus {
    outline: none;
    text-decoration: underline;
  }

  &:active {
    text-decoration: none;
  }
`

const InternalLink: React.FC<React.PropsWithChildren<unknown>> = ({ children, ...props }) => {
  return <StyledInternalLink {...props}>{children}</StyledInternalLink>
}

export default InternalLink
