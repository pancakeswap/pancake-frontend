import { useTranslation } from '@pancakeswap/localization'
import { Flex, Heading, Link, Text } from '@pancakeswap/uikit'
import { Result } from 'state/predictions/helpers'
import { Bet } from 'state/types'
import { styled } from 'styled-components'
import { getBlockExploreLink } from 'utils'
import { PayoutRow } from '../../RoundResult'
import { getMultiplier } from '../helpers'
import { AIBetResult } from './AIBetResult'
import { AIRoundResultHistory } from './AIRoundResultHistory'

interface AIBetDetailsProps {
  bet: Bet
  result: Result
}

const StyledBetDetails = styled.div`
  background-color: ${({ theme }) => theme.colors.dropdown};
  border-bottom: 2px solid ${({ theme }) => theme.colors.cardBorder};
  padding: 24px;
`

export const AIBetDetails: React.FC<React.PropsWithChildren<AIBetDetailsProps>> = ({ bet, result }) => {
  const { t } = useTranslation()
  const { totalAmount = 0, bullAmount = 0, bearAmount = 0 } = bet.round ?? {}
  const bullMultiplier = getMultiplier(totalAmount, bullAmount)
  const bearMultiplier = getMultiplier(totalAmount, bearAmount)

  return (
    <StyledBetDetails>
      {result === Result.CANCELED && (
        <Text as="p" color="failure" mb="24px">
          {t(
            'This round was automatically cancelled due to an error. If you entered a position, please reclaim your funds below.',
          )}
        </Text>
      )}
      {result !== Result.LIVE && <AIBetResult bet={bet} result={result} />}
      <Heading mb="8px">{t('Round History')}</Heading>
      {bet.round ? (
        <AIRoundResultHistory round={bet.round} mb="24px">
          <PayoutRow positionLabel={t('Follow AI')} multiplier={bullMultiplier} amount={bullAmount} />
          <PayoutRow positionLabel={t('Against AI')} multiplier={bearMultiplier} amount={bearAmount} />
        </AIRoundResultHistory>
      ) : null}
      {bet.round?.lockBlock && (
        <Flex alignItems="center" justifyContent="space-between" mb="8px">
          <Text>{t('Opening Block')}</Text>
          <Link href={getBlockExploreLink(bet.round.lockBlock, 'block')} external>
            {bet.round.lockBlock}
          </Link>
        </Flex>
      )}
      {bet.round?.closeBlock && (
        <Flex alignItems="center" justifyContent="space-between">
          <Text>{t('Closing Block')}</Text>
          <Link href={getBlockExploreLink(bet.round.closeBlock, 'block')} external>
            {bet.round.closeBlock}
          </Link>
        </Flex>
      )}
    </StyledBetDetails>
  )
}
