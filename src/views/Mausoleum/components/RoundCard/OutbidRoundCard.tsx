import React from 'react'
import styled from 'styled-components'
import { BlockIcon, CardBody } from '@rug-zombie-libs/uikit'
import { useTranslation } from 'contexts/Localization'
import { Round, BetPosition } from 'state/types'
import { RoundResult } from '../RoundResult'
import MultiplierArrow from './MultiplierArrow'
import Card from './Card'
import CardHeader from './CardHeader'
import CollectWinningsOverlay from './CollectWinningsOverlay'
import CanceledRoundCard from './CanceledRoundCard'

interface ExpiredRoundCardProps {
  bid: any;
  id: number;
  bidId: number;
}

const StyledExpiredRoundCard = styled(Card)`
  opacity: 0.7;
  transition: opacity 300ms;

  &:hover {
    opacity: 1;
  }
`

const OutbidRoundCard: React.FC<ExpiredRoundCardProps> = ({ bid, id, bidId }) => {
  const { t } = useTranslation()
  return (
    <StyledExpiredRoundCard>
      <CardHeader
        status="outbid"
        icon={<BlockIcon mr="4px" width="21px" color="textDisabled" />}
        title={t('Outbid')}
        bid={bid}
        id={bidId}
      />
      <CardBody p="16px" style={{ position: 'relative' }}>
        <RoundResult bid={bid} id={id} />
      </CardBody>
    </StyledExpiredRoundCard>
  )
}

export default OutbidRoundCard
