import React from 'react'
import styled, { keyframes } from 'styled-components'

import { NavLink } from 'react-router-dom'
import AccountLink from '../TopBar/components/AccountLink'
import { TranslateString } from '../../utils/translateTextHelpers'


interface MobileMenuProps {
  onDismiss: () => void
  visible?: boolean
}

const MobileMenu: React.FC<MobileMenuProps> = ({ onDismiss, visible }) => {
  if (visible) {
    return (
      <StyledMobileMenuWrapper>
        <StyledBackdrop onClick={onDismiss} />
        <StyledMobileMenu>
          <Wrapper onClick={onDismiss}>
            <AccountLink />
          </Wrapper>
          <StyledLink exact activeClassName="active" to="/" onClick={onDismiss}>
            🏡 Home
          </StyledLink>
          <StyledLink
            exact
            activeClassName="active"
            to="/farms"
            onClick={onDismiss}
          >
            👨‍🌾 Farms
          </StyledLink>
          <StyledLink
            exact
            activeClassName="active"
            to="/staking"
            onClick={onDismiss}
          >
            🥩 Staking
          </StyledLink>
          <StyledLink
            exact
            activeClassName="active"
            to="/syrup"
            onClick={onDismiss}
          >
            🍯 {TranslateString(282, 'SYRUP Pool')}
          </StyledLink>
          <a
            style={{
              paddingTop: '0.6em',
              color: 'white',
              width: '100%',
              fontSize: '24px',
              fontWeight: 700,
              boxSizing: 'border-box',
              textAlign: 'center',
              textDecoration: 'none',
            }}
            href="https://exchange.pancakeswap.finance"
            onClick={onDismiss}
          >
            🔄 Exchange
          </a>
          <a
            style={{
              paddingTop: '1.2em',
              color: 'white',
              width: '100%',
              fontSize: '24px',
              fontWeight: 700,
              boxSizing: 'border-box',
              textAlign: 'center',
              textDecoration: 'none',
            }}
            href="https://pancakeswap.info"
            onClick={onDismiss}
          >
            📈 Analytics
          </a>
        </StyledMobileMenu>
      </StyledMobileMenuWrapper>
    )
  }
  return null
}

const StyledBackdrop = styled.div`
  background-color: ${(props) => props.theme.colors.grey[600]}aa;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`

const StyledMobileMenuWrapper = styled.div`
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1000;
`

const slideIn = keyframes`
  0% {
    transform: translateX(0)
  }
  100% {
    transform: translateX(-100%);
  }
`

const Wrapper = styled.div`
  margin-bottom: 2em;
`

const StyledMobileMenu = styled.div`
  animation: ${slideIn} 0.3s forwards ease-out;
  background-color: ${(props) => props.theme.colors.grey[200]};
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  position: absolute;
  top: 0;
  left: 100%;
  bottom: 0;
  width: calc(100% - 48px);
`

const StyledLink = styled(NavLink)`
  box-sizing: border-box;
  color: #fff;
  font-size: 24px;
  font-weight: 700;
  padding: ${(props) => props.theme.spacing[3]}px
    ${(props) => props.theme.spacing[4]}px;
  text-align: center;
  text-decoration: none;
  width: 100%;
  &:hover {
    color: ${(props) => props.theme.colors.grey[500]};
  }
  &.active {
    color: ${(props) => props.theme.colors.grey[600]};
  }
`

export default MobileMenu
