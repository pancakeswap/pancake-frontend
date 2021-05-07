import React from 'react'
import styled from 'styled-components'
import { Card, CardBody } from '@pancakeswap/uikit'
import PrizesWonContent from './PrizesWonContent'
import NoPrizesContent from './NoPrizesContent'

const StyledCard = styled(Card)`
  ${(props) =>
    props.isDisabled
      ? `  
        margin-top: 16px;
        background-color: unset;
        box-shadow: unset;
        border: 1px solid ${props.theme.colors.textDisabled};

        ${props.theme.mediaQueries.sm} {
          margin-top: 24px;
        }

        ${props.theme.mediaQueries.lg} {
          margin-top: 32px;
        }
        `
      : ``}
`

interface YourPrizesCardProps {
  isAWin: boolean
  onSuccess: () => void
}

const YourPrizesCard: React.FC<YourPrizesCardProps> = ({ isAWin, onSuccess }) => {
  return (
    <StyledCard isDisabled={!isAWin} isActive={isAWin}>
      <CardBody>{isAWin ? <PrizesWonContent onSuccess={onSuccess} /> : <NoPrizesContent />}</CardBody>
    </StyledCard>
  )
}

export default YourPrizesCard
