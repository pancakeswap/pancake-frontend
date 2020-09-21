import React from 'react'
import styled from 'styled-components'

const Card: React.FC = ({ children }) => <StyledCard>{children}</StyledCard>

const StyledCard = styled.div`
  background: #FFFDFA;
  border-radius: 20px;
  display: flex;
  color: #7645D9;
  flex: 1;
  box-shadow: 0px 2px 8px rgba(171, 133, 115, 0.21);
  border-radius: 20px;

  flex-direction: column;
`

export default Card
