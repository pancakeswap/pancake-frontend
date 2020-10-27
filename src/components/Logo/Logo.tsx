import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

interface LogoProps {
  isDark: boolean
}

const Logo: React.FC<LogoProps> = ({ isDark }) => {
  return (
    <StyledLogo to="/">
      <img
        src={`/images/${isDark ? 'chef3' : 'chef2'}.png`}
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
