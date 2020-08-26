import React from 'react'
import styled, { keyframes } from 'styled-components'

import { NavLink } from 'react-router-dom'

interface MobileMenuProps {
  onDismiss: () => void,
  visible?: boolean
}

const MobileMenu: React.FC<MobileMenuProps> = ({ onDismiss, visible }) => {
  if (visible) {
    return (
      <StyledMobileMenuWrapper>
        <StyledBackdrop onClick={onDismiss} />
        <StyledMobileMenu>
          <StyledLink exact activeClassName="active" to="/" onClick={onDismiss}>Home</StyledLink>
          <StyledLink exact activeClassName="active" to="/farms" onClick={onDismiss}>Farms</StyledLink>
          <StyledLink exact activeClassName="active" to="/faq" onClick={onDismiss}>FAQ</StyledLink>
        </StyledMobileMenu>
      </StyledMobileMenuWrapper>
    )
  }
  return null
}

const StyledBackdrop = styled.div`
  background-color: ${props => props.theme.color.grey[600]}aa;
  position: absolute;
  top: 0; right: 0; bottom: 0; left: 0;
`

const StyledMobileMenuWrapper = styled.div`
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0; right: 0; bottom: 0; left: 0;
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

const StyledMobileMenu = styled.div`
  animation: ${slideIn} 0.3s forwards ease-out;
  background-color: ${props => props.theme.color.grey[200]};
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  position: absolute;
  top: 0; left: 100%; bottom: 0;
  width: calc(100% - 48px);
`

const StyledLink = styled(NavLink)`
  box-sizing: border-box;
  color: ${props => props.theme.color.grey[400]};
  font-size: 24px;
  font-weight: 700;
  padding: ${props => props.theme.spacing[3]}px ${props => props.theme.spacing[4]}px;
  text-align: center;
  text-decoration: none;
  width: 100%;
  &:hover {
    color: ${props => props.theme.color.grey[500]};
  }
  &.active {
    color: ${props => props.theme.color.primary.main};
  }
`

export default MobileMenu