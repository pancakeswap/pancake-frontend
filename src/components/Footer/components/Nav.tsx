import React from 'react'
import styled from 'styled-components'
import TranslatedText from '../../TranslatedText'

const Nav: React.FC = () => {
  return (
    <StyledNav>
      <StyledLink target="_blank" href="https://t.me/PancakeSwap">
        <TranslatedText translationId={308}>Telegram</TranslatedText>
      </StyledLink>
      <StyledLink target="_blank" href="https://medium.com/@pancakeswap">
        <TranslatedText translationId={310}>Blog</TranslatedText>
      </StyledLink>
      <StyledLink target="_blank" href="https://github.com/pancakeswap">
        <TranslatedText translationId={312}>Github</TranslatedText>
      </StyledLink>
      <StyledLink target="_blank" href="https://twitter.com/pancakeswap">
        <TranslatedText translationId={314}>Twitter</TranslatedText>
      </StyledLink>
      <StyledLink href="https://docs.pancakeswap.finance" target="_blank">
        <TranslatedText translationId={286}>Docs</TranslatedText>
      </StyledLink>
    </StyledNav>
  )
}

const StyledNav = styled.nav`
  align-items: center;
  display: flex;
`

const StyledLink = styled.a`
  color: #12aab5;
  padding-left: ${(props) => props.theme.spacing[3]}px;
  padding-right: ${(props) => props.theme.spacing[3]}px;
  text-decoration: none;
  &:hover {
    color: #805e49;
  }
`

export default Nav
