import React from 'react'
import styled from 'styled-components'

const Nav: React.FC = () => {
  return (
    <StyledNav>
      <StyledLink target="_blank" href="https://t.me/PancakeSwap">
        Telegram
      </StyledLink>
      <StyledLink target="_blank" href="https://medium.com/@pancakeswap">
        Blog
      </StyledLink>
      <StyledLink target="_blank" href="https://github.com/pancakeswap">
        Github
      </StyledLink>
      <StyledLink target="_blank" href="https://twitter.com/pancakeswap">
        Twitter
      </StyledLink>
      <StyledLink
        href="https://docs.pancakeswap.finance"
        target="_blank"
      >
        Docs
      </StyledLink>
    </StyledNav>
  )
}

const StyledNav = styled.nav`
  align-items: center;
  display: flex;
`

const StyledLink = styled.a`
  color: ${(props) => props.theme.colors.grey[400]};
  padding-left: ${(props) => props.theme.spacing[3]}px;
  padding-right: ${(props) => props.theme.spacing[3]}px;
  text-decoration: none;
  &:hover {
    color: ${(props) => props.theme.colors.grey[500]};
  }
`

export default Nav
