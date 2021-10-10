import React from 'react'
import styled from 'styled-components'
import { Box, CardBody, Flex, LinkExternal, PlayCircleOutlineIcon, Text, useTooltip } from '@rug-zombie-libs/uikit'
import { useTranslation } from 'contexts/Localization'
import { RoundResult } from '../RoundResult'
import Card from './Card'
import CardHeader from './CardHeader'

interface LiveRoundCardProps {
  bid: any,
  id: number
}

const LeaderRoundCard: React.FC<LiveRoundCardProps> = ({ bid, id }) => {
  const { t } = useTranslation()
  const StyledExpiredRoundCard = styled(Card)`
  opacity: 0.7;
  transition: opacity 300ms;

  &:hover {
    opacity: 1;
  }
`

  return (
      <StyledExpiredRoundCard>
        <CardHeader
          status="outbid"
          icon={<PlayCircleOutlineIcon mr="4px" width="24px" color="secondary" />}
          title={t('Leader')}
          bid={bid}
          id={id}
        />
        <CardBody p="16px" style={{ position: 'relative' }}>
          <RoundResult bid={bid} id={id} />
        </CardBody>
      </StyledExpiredRoundCard>
  )
}

export default LeaderRoundCard
