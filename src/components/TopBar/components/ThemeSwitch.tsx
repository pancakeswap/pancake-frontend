import React, { useCallback } from 'react'
import styled from 'styled-components'
import { SunIcon, MoonIcon } from '../../icons'

const Button = styled.div`
  width: 20px;
  height: 20px;
  cursor: pointer;
  @media (max-width: 850px) {
    margin-left: 0.1rem;
  }
`

type IThemeProps = {
  isDark: boolean
  toogleTheme: (isDark: boolean) => void
}

const ThemeSwitch: React.FC<IThemeProps> = ({ isDark, toogleTheme }) => {
  const handleClick = useCallback(() => {
    toogleTheme(!isDark)
  }, [isDark, toogleTheme])

  return (
    <Button onClick={handleClick}>{isDark ? <SunIcon /> : <MoonIcon />}</Button>
  )
}

export default ThemeSwitch
