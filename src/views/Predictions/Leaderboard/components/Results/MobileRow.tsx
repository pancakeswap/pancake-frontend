import React from 'react'
import { Box, Text } from '@tovaswapui/uikit'
import { PredictionUser } from 'state/types'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { NetWinningsRow, Row } from './styles'
import ResultAvatar from './ResultAvatar'

interface MobileRowProps {
  rank?: number
  user: PredictionUser
}

const StyledMobileRow = styled(Box)`
  background-color: ${({ theme }) => theme.card.background};
  border-bottom: 1px solid ${({ theme }) => theme.colors.cardBorder};

  &:first-child {
    border-top: 1px solid ${({ theme }) => theme.colors.cardBorder};
  }
`

const MobileRow: React.FC<MobileRowProps> = ({ rank, user }) => {
  const { t } = useTranslation()

  return (
    <StyledMobileRow p="16px">
      <Row mb="16px">
        {rank ? <Text fontWeight="bold" color="secondary">{`#${rank}`}</Text> : <div />}
        <ResultAvatar user={user} />
      </Row>
      <Row mb="4px">
        <Text fontSize="12px" color="textSubtle">
          {t('Win Rate')}
        </Text>
        <Text fontWeight="bold">
          {`${user.winRate.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}%`}
        </Text>
      </Row>
      <NetWinningsRow amount={user.netBNB} />
      <Row>
        <Text fontSize="12px" color="textSubtle">
          {t('Rounds Won')}
        </Text>
        <Text fontWeight="bold">{`${user.totalBetsClaimed.toLocaleString()}/${user.totalBets.toLocaleString()}`}</Text>
      </Row>
    </StyledMobileRow>
  )
}

export default MobileRow
