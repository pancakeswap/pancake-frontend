import React from 'react'
import PancakeSquadHeader from './components/Header'
import { StyledSquadContainer } from './styles'

const PancakeSquad: React.FC = () => {
  return (
    <StyledSquadContainer mt="56px">
      <PancakeSquadHeader />
    </StyledSquadContainer>
  )
}

export default PancakeSquad
