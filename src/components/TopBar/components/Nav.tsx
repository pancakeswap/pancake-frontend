import React from 'react'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'
import TranslatedText from '../../TranslatedText/TranslatedText'

const Nav: React.FC = () => {
  return (
    <>
      <StyledNav>
        <StyledLink exact activeClassName="active" to="/farms">
          <TranslatedText translationId={2}>Farm</TranslatedText>
        </StyledLink>
        <StyledLink exact activeClassName="active" to="/staking">
          <TranslatedText translationId={4}>Staking</TranslatedText>
        </StyledLink>
        <StyledLink exact activeClassName="active" to="/syrup">
          <TranslatedText translationId={6}>SYRUP Pool</TranslatedText>
        </StyledLink>
        <StyledAbsoluteLink
          href="https://exchange.pancakeswap.finance"
          target="_blank"
        >
          <TranslatedText translationId={8}>Exchange</TranslatedText>
        </StyledAbsoluteLink>
        <StyledAbsoluteLink
          href="https://docs.pancakeswap.finance"
          target="_blank"
        >
          <TranslatedText translationId={10}>Docs</TranslatedText>
        </StyledAbsoluteLink>
        <StyledAbsoluteLink
          href="https://voting.pancakeswap.finance"
          target="_blank"
        >
          <TranslatedText translationId={12}>Voting</TranslatedText>
        </StyledAbsoluteLink>
        <StyledLink exact activeClassName="active" to="/lottery">
          <TranslatedText translationId={14}>Lottery</TranslatedText>
        </StyledLink>
      </StyledNav>
    </>
  )
}

const StyledNav = styled.nav`
  align-items: center;
  display: flex;
  @media (max-width: 850px) {
    display: none;
  }
`

const StyledLink = styled(NavLink)`
  color: ${(props) => props.theme.colors.grey[400]};
  font-weight: 700;
  padding-left: ${(props) => props.theme.spacing[3]}px;
  padding-right: ${(props) => props.theme.spacing[3]}px;
  text-decoration: none;
  text-align: center;
  &:hover {
    color: #452a7a;
  }
  &.active {
    color: ${(props) => props.theme.colors.grey[600]};
  }
  @media (max-width: 400px) {
    padding-left: ${(props) => props.theme.spacing[2]}px;
    padding-right: ${(props) => props.theme.spacing[2]}px;
  }
`

const StyledAbsoluteLink = styled.a`
  color: ${(props) => props.theme.colors.grey[400]};
  font-weight: 700;
  padding-left: ${(props) => props.theme.spacing[3]}px;
  padding-right: ${(props) => props.theme.spacing[3]}px;
  text-decoration: none;
  text-align: center;
  &:hover {
    color: #452a7a;
  }
  &.active {
    color: ${(props) => props.theme.colors.grey[600]};
  }
  @media (max-width: 400px) {
    padding-left: ${(props) => props.theme.spacing[2]}px;
    padding-right: ${(props) => props.theme.spacing[2]}px;
  }
`

export default Nav
