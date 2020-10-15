import React from 'react'
import styled from 'styled-components'

interface CardIconProps {
  children?: React.ReactNode
}

const CardIcon: React.FC<CardIconProps> = ({ children }) => (
  <StyledCardIcon>{children}</StyledCardIcon>
)

const StyledCardIcon = styled.div`
  background: ${(props) => props.theme.colors.cardBg};
  font-size: 56px;
  height: 80px;
  width: 150px;
  border-radius: 40px;
  align-items: center;
  display: flex;
  justify-content: center;
  margin: 0 auto ${(props) => props.theme.spacing[3]}px;
  img {
    width: 100%;
    max-width: 80px;
  }
`

export default CardIcon
