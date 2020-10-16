import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import chef2 from '../../assets/img/chef2.png'
import chef3 from '../../assets/img/chef3.png'

interface LogoProps {
  isDark: boolean
}

const Logo: React.FC<LogoProps> = ({ isDark }) => {
  return (
    <StyledLogo to="/">
      <img
        src={isDark ? chef3 : chef2}
        height="32"
        style={{ marginTop: -4 }}
        alt="PancakeSwap"
      />
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

export default Logo
