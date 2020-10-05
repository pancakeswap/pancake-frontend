import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import useTheme from '../../hooks/useTheme'
import chef2 from '../../assets/img/chef2.png'
import chef3 from '../../assets/img/chef3.png'

interface LogoProps {
    isDark: boolean
}

const Logo: React.FC<LogoProps> = ({isDark}) => {

  return (
    <StyledLogo to="/">
      {
        isDark ?
        <img src={chef3} height="32" style={{ marginTop: -4 }} />
        :
        <img src={chef2} height="32" style={{ marginTop: -4 }} />
      }
    </StyledLogo>
  )
}

const StyledLogo = styled(Link)`
  align-items: center;
  display: flex;
  justify-content: center;
  margin: 0;
  min-height: 44px;
  min-width: 44px;
  padding: 0;
  text-decoration: none;
`

const StyledText = styled.span`
  color: ${(props) => props.theme.colors.primary};
  font-family: 'Reem Kufi', sans-serif;
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 0.03em;
  margin-left: ${(props) => props.theme.spacing[2]}px;
  @media (max-width: 400px) {
    display: none;
  }
`

const MasterChefText = styled.span`
  font-family: 'Kaushan Script', sans-serif;
`

export default Logo
