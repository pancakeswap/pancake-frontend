import React, { useContext } from 'react'
import styled, { ThemeContext } from 'styled-components'

interface ButtonProps {
  children?: React.ReactNode
  disabled?: boolean
  href?: string
  onClick?: () => void
  size?: 'sm' | 'md' | 'lg'
}

const Button: React.FC<ButtonProps> = ({
  children,
  disabled,
  onClick,
  size,
}) => {
  const { colors, spacing } = useContext(ThemeContext)
  const buttonColor = colors.primaryBright

  let boxShadow: string
  let buttonSize: number
  let buttonPadding: number
  let fontSize: number
  switch (size) {
    case 'sm':
      buttonPadding = spacing[2]
      buttonSize = 36
      fontSize = 14
      break
    case 'lg':
      buttonPadding = spacing[4]
      buttonSize = 72
      fontSize = 16
      break
    case 'md':
    default:
      buttonPadding = spacing[4]
      buttonSize = 56
      fontSize = 16
  }

  return (
    <StyledButton
      boxShadow={boxShadow}
      color={buttonColor}
      disabled={disabled}
      fontSize={fontSize}
      onClick={onClick}
      padding={buttonPadding}
      size={buttonSize}
    >
      {children}
    </StyledButton>
  )
}

interface StyledButtonProps {
  boxShadow: string
  color: string
  disabled?: boolean
  fontSize: number
  padding: number
  size: number
}

const StyledButton = styled.button<StyledButtonProps>`
  align-items: center;
  background: ${(props) =>
    !props.disabled ? props.theme.card.background : `#ddd`};
  color: ${(props) => (!props.disabled ? props.color : `#acaaaf`)};
  border: 2px solid ${(props) => (!props.disabled ? props.color : `#eee`)};
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  font-size: ${(props) => props.fontSize}px;
  font-weight: 700;
  justify-content: center;
  outline: none;
  pointer-events: ${(props) => (!props.disabled ? undefined : 'none')};
  width: 100%;
  padding: ${(props) => props.padding}px;
  height: ${(props) => props.size}px;

  @media (max-width: 500px) {
    padding: 4px;
    height: auto;
  }
`
export default Button
