import React from 'react'
import { orderBy } from 'lodash'
import { Box, Heading, Text } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { Bet } from 'state/types'
import HistoricalBet from './HistoricalBet'
import V1ClaimCheck from '../v1/V1ClaimCheck'

interface RoundsTabProps {
  hasBetHistory: boolean
  bets: Bet[]
}

const RoundsTab: React.FC<RoundsTabProps> = ({ hasBetHistory, bets }) => {
  const { t } = useTranslation()

  return hasBetHistory ? (
    <>
      <V1ClaimCheck />
      {orderBy(bets, ['round.epoch'], ['desc']).map((bet) => (
        <HistoricalBet key={bet.round.epoch} bet={bet} />
      ))}
    </>
  ) : (
    <>
      <V1ClaimCheck />
      <Box p="24px">
        <Heading size="lg" textAlign="center" mb="8px">
          {t('No prediction history available')}
        </Heading>
        <Text as="p" textAlign="center">
          {t(
            'If you are sure you should see history here, make sure you’re connected to the correct wallet and try again.',
          )}
        </Text>
      </Box>
    </>
  )
}

export default RoundsTab
