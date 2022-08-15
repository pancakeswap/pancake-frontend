import { useWeb3React } from '@web3-react/core'
import orderBy from 'lodash/orderBy'
import { Box, Button, Flex, Heading, Text } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import useLocalDispatch from 'contexts/LocalRedux/useLocalDispatch'
import { Bet } from 'state/types'
import { fetchNodeHistory } from 'state/predictions'
import { useConfig } from 'views/Predictions/context/ConfigProvider'
import { useGetCurrentHistoryPage, useGetHasHistoryLoaded, useGetIsFetchingHistory } from 'state/predictions/hooks'
import HistoricalBet from './HistoricalBet'
import V1ClaimCheck from '../v1/V1ClaimCheck'

interface RoundsTabProps {
  hasBetHistory: boolean
  bets: Bet[]
}

const RoundsTab: React.FC<React.PropsWithChildren<RoundsTabProps>> = ({ hasBetHistory, bets }) => {
  const { t } = useTranslation()
  const dispatch = useLocalDispatch()
  const { account } = useWeb3React()
  const hasHistoryLoaded = useGetHasHistoryLoaded()
  const currentHistoryPage = useGetCurrentHistoryPage()
  const isFetchingHistory = useGetIsFetchingHistory()
  const { token } = useConfig()

  const handleClick = () => {
    dispatch(fetchNodeHistory({ account, page: currentHistoryPage + 1 }))
  }

  const v1Claim = token.symbol === 'BNB' ? <V1ClaimCheck /> : null

  return hasBetHistory ? (
    <>
      {v1Claim}
      {orderBy(bets, ['round.epoch'], ['desc']).map((bet) => (
        <HistoricalBet key={bet.round.epoch} bet={bet} />
      ))}
      {hasBetHistory && !hasHistoryLoaded && (
        <Flex alignItems="center" justifyContent="center" py="24px">
          <Button variant="secondary" scale="sm" onClick={handleClick} disabled={isFetchingHistory}>
            {t('View More')}
          </Button>
        </Flex>
      )}
    </>
  ) : (
    <>
      {v1Claim}
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
