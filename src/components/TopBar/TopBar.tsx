import React, { useContext } from 'react'
import styled, { ThemeContext } from 'styled-components'

import Container from '../Container'
import Logo from '../Logo'

import AccountButton from './components/AccountButton'
import LanguageSelectMenu from './components/LanguageSelectMenu'
import Nav from './components/Nav'
import ThemeSwitch from './components/ThemeSwitch'

interface TopBarProps {
  isDark: boolean
  toogleTheme: (isDark: boolean) => void
  onPresentMobileMenu: () => void
}

const TopBar: React.FC<TopBarProps> = ({
  isDark,
  toogleTheme,
  onPresentMobileMenu,
}) => {
  const { colors, spacing } = useContext(ThemeContext)
  const buttonColor = colors.bg
  let buttonSize: number
  let buttonPadding: number
  buttonPadding = spacing[2]
  buttonSize = 36

  return (
    <StyledTopBar>
      <Container size="lg">
        <StyledTopBarInner>
          <StyledLogoWrapper>
            <Logo isDark={isDark} />
          </StyledLogoWrapper>
          <Nav />
          <ThemeSwitch isDark={isDark} toogleTheme={toogleTheme} />
          <StyledAccountButtonWrapper>
            <AccountButton />
          </StyledAccountButtonWrapper>
          <StyledAccountMenuWrapper>
            <MenuButton
              padding={buttonPadding}
              size={buttonSize}
              color={buttonColor}
              onClick={onPresentMobileMenu}
            >
              Menu
            </MenuButton>
          </StyledAccountMenuWrapper>
          <LanguageSelectMenu />
        </StyledTopBarInner>
      </Container>
    </StyledTopBar>
  )
}

const StyledLogoWrapper = styled.div`
  width: 260px;
  @media (max-width: 420px) {
    width: 200px;

    img {
      width: 100%;
      height: auto;
    }
  }
`

const StyledTopBar = styled.div``

const StyledTopBarInner = styled.div`
  align-items: center;
  display: flex;
  height: ${(props) => props.theme.topBarSize}px;
  justify-content: space-between;
  max-width: ${(props) => props.theme.siteWidth}px;
  width: 100%;
`

const StyledAccountButtonWrapper = styled.div`
  @media (max-width: 850px) {
    display: none;
  }
  align-items: center;
  display: flex;
  justify-content: flex-end;
  width: 156px;
  @media (max-width: 400px) {
    justify-content: center;
    width: auto;
  }
`
const StyledAccountMenuWrapper = styled.div``

interface MenuButtonProps {
  padding: number
  size: number
}

const MenuButton = styled.button<MenuButtonProps>`
  text-align: center;
  color: ${(props) => props.color};
  font-size: 17px;
  font-weight: 700;
  background: #47d3db;
  border-radius: 12px;
  display: none;
  margin-left: 0.2rem;
  padding: ${(props) => props.padding}px;
  height: ${(props) => props.size}px;
  outline: none;
  border-width: 0;

  @media (max-width: 850px) {
    display: flex;
  }
  @media (max-width: 450px) {
    /* padding: 4px; */
    height: auto;
  }
`

export default TopBar
