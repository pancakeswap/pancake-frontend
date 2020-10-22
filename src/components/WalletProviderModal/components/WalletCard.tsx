import React from 'react'
import styled from 'styled-components'

import Button from '../../Button'
import Spacer from '../../Spacer'

interface WalletCardProps {
  icon: React.ReactNode
  onConnect: () => void
  title: string
}

const WalletCard: React.FC<WalletCardProps> = ({ icon, onConnect, title }) => (
  <StyledCard onClick={onConnect}>
    <StyledCardContent>
      <StyledCardIcon>{icon}</StyledCardIcon>
      <StyledCardTitle>{title}</StyledCardTitle>
    </StyledCardContent>
  </StyledCard>
)

const StyledCardIcon = styled.div`
  background: ${(props) => props.theme.colors.cardBg};
  font-size: 56px;
  height: 40px;
  width: 40px;
  border-radius: 40px;
  align-items: center;
  display: flex;
  justify-content: center;
  img {
    height: auto!important;
    width: 30px;
  }
`

const StyledCard = styled.div`
  background: ${(props) => props.theme.colors.cardBg};
  border-radius: 20px;
  display: flex;
  color: ${(props) => props.theme.colors.secondary};
  flex: 1;
  box-shadow: 0px 2px 8px rgba(171, 133, 115, 0.21);
  border-radius: 20px;
  flex-direction: column;
`

const StyledCardContent = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  cursor: pointer;
  padding: ${(props) => props.theme.spacing[2]}px;
`

const StyledCardTitle = styled.div`
  color: ${(props) => props.theme.colors.primary};
  font-size: 16px;
  font-weight: 800;
  line-height: 40px;
  padding: 0 20px;

`

export default WalletCard
