import React from 'react'
import styled from 'styled-components'

import Container from '../Container'
import Logo from '../Logo'

import AccountButton from './components/AccountButton'
import Nav from './components/Nav'

interface TopBarProps {
    onPresentMobileMenu: () => void
}

const TopBar: React.FC<TopBarProps> = ({onPresentMobileMenu}) => {
    return (
        <StyledTopBar>
            <Container size="lg">
                <StyledTopBarInner>
                    <StyledLogoWrapper>
                        <Logo/>
                    </StyledLogoWrapper>
                    <Nav/>
                    <StyledAccountButtonWrapper>
                        <AccountButton/>
                    </StyledAccountButtonWrapper>
                    <StyledAccountMenuWrapper>
                        <Menu onClick={onPresentMobileMenu}>Menu</Menu>
                    </StyledAccountMenuWrapper>
                </StyledTopBarInner>
            </Container>
        </StyledTopBar>
    )
}

const Menu = styled.div`
  margin: 0 auto;
  width: 110px;
  text-align: center;
  color: white;
  font-size: 17px;
  padding: 3px 3px 3px 3px;
  font-weight: 700;
  background: #47d3db;
  border-radius: 20px;
  display: nones;
  display: none;
  @media (max-width: 850px) {
    display: block;
  }
`

const StyledLogoWrapper = styled.div`
  width: 260px;
  @media (max-width: 400px) {
    width: auto;
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
const StyledNavWrapper = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  @media (max-width: 400px) {
    display: none;
  }
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
const StyledAccountMenuWrapper = styled.div`
  @media (mim-width: 850px) {
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

const StyledMenuButton = styled.button`
  background: none;
  border: 0;
  margin: 0;
  outline: 0;
  padding: 0;
  display: none;
  @media (max-width: 400px) {
    align-items: center;
    display: flex;
    height: 44px;
    justify-content: center;
    width: 44px;
  }
`

export default TopBar
