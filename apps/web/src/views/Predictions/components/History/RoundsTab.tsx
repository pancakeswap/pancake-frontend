import { useTranslation } from '@pancakeswap/localization'
import { Box, Button, Flex, Heading, Text } from '@pancakeswap/uikit'
import useLocalDispatch from 'contexts/LocalRedux/useLocalDispatch'
import { useActiveChainId } from 'hooks/useActiveChainId'
import orderBy from 'lodash/orderBy'
import { fetchNodeHistory } from 'state/predictions'
import {
  useGetCurrentHistoryPage,
  useGetHasHistoryLoaded,
  useGetHistoryFilter,
  useGetIsFetchingHistory,
} from 'state/predictions/hooks'
import { Bet, HistoryFilter } from 'state/types'
import { useConfig } from 'views/Predictions/context/ConfigProvider'
import { useAccount } from 'wagmi'
import V1ClaimCheck from '../v1/V1ClaimCheck'
import HistoricalBet from './HistoricalBet'

interface RoundsTabProps {
  hasBetHistory: boolean
  bets: Bet[]
}

const RoundsTab: React.FC<React.PropsWithChildren<RoundsTabProps>> = ({ hasBetHistory, bets }) => {
  const { t } = useTranslation()
  const dispatch = useLocalDispatch()
  const { address: account } = useAccount()
  const { chainId } = useActiveChainId()
  const historyFilter = useGetHistoryFilter()
  const hasHistoryLoaded = useGetHasHistoryLoaded()
  const currentHistoryPage = useGetCurrentHistoryPage()
  const isFetchingHistory = useGetIsFetchingHistory()
  const config = useConfig()

  const handleClick = () => {
    if (account && chainId) {
      dispatch(fetchNodeHistory({ account, chainId, page: currentHistoryPage + 1 }))
    }
  }

  const v1Claim = config?.token?.symbol === 'BNB' ? <V1ClaimCheck /> : null

  return hasBetHistory ? (
    <>
      {v1Claim}
      {orderBy(bets, ['round.epoch'], ['desc'])?.map((bet) => (
        <HistoricalBet key={bet?.round?.epoch} bet={bet} />
      ))}
      {hasBetHistory && !hasHistoryLoaded && historyFilter === HistoryFilter.ALL && (
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
