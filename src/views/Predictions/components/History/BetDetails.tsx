import React from 'react'
import styled from 'styled-components'
import { Bet } from 'state/types'
import { useTranslation } from 'contexts/Localization'
import { Flex, Text, Link, Heading } from '@pancakeswap-libs/uikit'
import { RoundResult } from '../RoundResult'
import BetResult, { Result } from './BetResult'

interface BetDetailsProps {
  bet: Bet
  result: Result
}

const StyledBetDetails = styled.div`
  background-color: ${({ theme }) => theme.colors.dropdown};
  border-bottom: 2px solid ${({ theme }) => theme.colors.borderColor};
  padding: 24px;
`

const BetDetails: React.FC<BetDetailsProps> = ({ bet, result }) => {
  const { t } = useTranslation()

  return (
    <StyledBetDetails>
      {result === Result.CANCELED && (
        <Text as="p" color="failure" mb="24px">
          {t(
            'This round was automatically canceled due to an error. If you entered a position, please reclaim your funds below.',
          )}
        </Text>
      )}
      {result !== Result.LIVE && <BetResult bet={bet} result={result} />}
      <Heading mb="8px">{t('Round History')}</Heading>
      <RoundResult round={bet.round} mb="24px" />
      <Flex alignItems="center" justifyContent="space-between" mb="8px">
        <Text>{t('Opening Block')}</Text>
        <Link href={`https://bscscan.com/block/${bet.round.lockBlock}`} external>
          {bet.round.lockBlock}
        </Link>
      </Flex>
      <Flex alignItems="center" justifyContent="space-between">
        <Text>{t('Closing Block')}</Text>
        <Link href={`https://bscscan.com/block/${bet.round.endBlock}`} external>
          {bet.round.endBlock}
        </Link>
      </Flex>
    </StyledBetDetails>
  )
}

export default BetDetails
