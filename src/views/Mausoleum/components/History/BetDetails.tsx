import React from 'react'
import styled from 'styled-components'
import { Bet } from 'state/types'
import { useTranslation } from 'contexts/Localization'
import { Flex, Text, Link, Heading } from '@rug-zombie-libs/uikit'
import { RoundResult } from '../RoundResult'
import BetResult, { Result } from './BetResult'

interface BetDetailsProps {
  bid: any;
  id: number;
}

const StyledBetDetails = styled.div`
  background-color: ${({ theme }) => theme.colors.dropdown};
  border-bottom: 2px solid ${({ theme }) => theme.colors.borderColor};
  padding: 24px;
`

const BetDetails: React.FC<BetDetailsProps> = ({ bid, id }) => {
  const { t } = useTranslation()

  return (
    <StyledBetDetails>
      <Heading mb="8px">{t('Round History')}</Heading>
      <RoundResult bid={bid} id={id} mb="24px" />
      <Flex alignItems="center" justifyContent="space-between" mb="8px">
        <Text>{t('Opening Block')}</Text>
        <Link href="https://bscscan.com/block/getBidTx" external>
          bet.round.lockBlock
        </Link>
      </Flex>
      <Flex alignItems="center" justifyContent="space-between">
        <Text>{t('Closing Block')}</Text>
        <Link href="https://bscscan.com/block/getBidTx" external>
          bet.round.endBlock
        </Link>
      </Flex>
    </StyledBetDetails>
  )
}

export default BetDetails
