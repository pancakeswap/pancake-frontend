import React, { useContext } from 'react'
import styled, { ThemeContext } from 'styled-components'

import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'

interface DialProps {
  children?: React.ReactNode,
  color?: 'primary' | 'secondary',
  disabled?: boolean,
  size?: number,
  value: number
}

const Dial: React.FC<DialProps> = ({ children, color, disabled, size = 256, value }) => {
  const { color: themeColor } = useContext(ThemeContext)
  let pathColor = themeColor.secondary.main
  if (color === 'primary') {
    pathColor = themeColor.primary.main
  }

  return (
    <StyledDial size={size}>
      <StyledOuter>
        <CircularProgressbar
          value={value}
          styles={buildStyles({
            strokeLinecap: 'round',
            pathColor: !disabled ? pathColor : themeColor.grey[400],
            pathTransitionDuration: 1,
          })}
        />
      </StyledOuter>
      <StyledInner size={size}>
        {children}
      </StyledInner>
    </StyledDial>
  )
}

interface StyledInnerProps {
  size: number
}

const StyledDial = styled.div<StyledInnerProps>`
  padding: calc(${props => props.size}px * 24 / 256);
  position: relative;
  height: ${props => props.size}px;
  width: ${props => props.size}px;
`

const StyledInner = styled.div<StyledInnerProps>`
  align-items: center;
  background-color: ${props => props.theme.color.grey[200]};
  border-radius: ${props => props.size}px;
  display: flex;
  justify-content: center;
  position: relative;
  height: ${props => props.size}px;
  width: ${props => props.size}px;
`

const StyledOuter = styled.div`
  background-color: ${props => props.theme.color.grey[300]};
  border-radius: 10000px;
  position: absolute;
  top: 0; right: 0; bottom: 0; left: 0;
`

export default Dial