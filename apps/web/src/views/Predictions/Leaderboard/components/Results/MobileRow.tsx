import { useTranslation } from '@pancakeswap/localization'
import { Token } from '@pancakeswap/sdk'
import { Box, Text } from '@pancakeswap/uikit'
import { PredictionUser } from 'state/types'
import { styled } from 'styled-components'
import ResultAvatar from './ResultAvatar'
import { NetWinningsRow, Row } from './styles'

interface MobileRowProps {
  rank?: number
  user: PredictionUser
  token: Token | undefined
  api: string
}

const StyledMobileRow = styled(Box)`
  background-color: ${({ theme }) => theme.card.background};
  border-bottom: 1px solid ${({ theme }) => theme.colors.cardBorder};

  &:first-child {
    border-top: 1px solid ${({ theme }) => theme.colors.cardBorder};
  }
`

const MobileRow: React.FC<React.PropsWithChildren<MobileRowProps>> = ({ rank, user, token, api }) => {
  const { t } = useTranslation()

  return (
    <StyledMobileRow p="16px">
      <Row mb="16px">
        {rank ? <Text fontWeight="bold" color="secondary">{`#${rank}`}</Text> : <div />}
        <ResultAvatar user={user} token={token} api={api} />
      </Row>
      <Row mb="4px">
        <Text fontSize="12px" color="textSubtle">
          {t('Win Rate')}
        </Text>
        <Text fontWeight="bold">
          {`${user.winRate.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}%`}
        </Text>
      </Row>
      <NetWinningsRow amount={user.netBNB} token={token} />
      <Row>
        <Text fontSize="12px" color="textSubtle">
          {t('Rounds Won')}
        </Text>
        <Text fontWeight="bold">{`${user.totalBetsClaimed}/${user.totalBets}`}</Text>
      </Row>
    </StyledMobileRow>
  )
}

export default MobileRow
