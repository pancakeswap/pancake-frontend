import React, { useEffect } from 'react'
import { Box, Heading, Spinner, Text } from '@pancakeswap-libs/uikit'
import { useWeb3React } from '@web3-react/core'
import styled from 'styled-components'
import { fetchHistory } from 'state/predictions'
import { HistoryFilter } from 'state/types'
import { useTranslation } from 'contexts/Localization'
import { orderBy } from 'lodash'
import { useAppDispatch } from 'state'
import {
  useGetCurrentEpoch,
  useGetHistoryByAccount,
  useGetHistoryFilter,
  useGetIsFetchingHistory,
  useIsHistoryPaneOpen,
} from 'state/hooks'
import { Header, HistoricalBet } from './components/History'

const StyledHistory = styled.div`
  background-color: ${({ theme }) => theme.card.background};
  display: flex;
  flex-direction: column;
  height: 100%;
`

const BetWrapper = styled.div`
  flex: 1;
  height: 100%;
  overflow-y: auto;
  position: relative;
`

const SpinnerWrapper = styled.div`
  align-items: center;
  background-color: ${({ theme }) => theme.card.background};
  display: flex;
  left: 0;
  height: 100%;
  justify-content: center;
  position: absolute;
  top: 0;
  width: 100%;
`

const History = () => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const dispatch = useAppDispatch()
  const isHistoryPaneOpen = useIsHistoryPaneOpen()
  const isFetchingHistory = useGetIsFetchingHistory()
  const historyFilter = useGetHistoryFilter()
  const currentEpoch = useGetCurrentEpoch()
  const bets = useGetHistoryByAccount(account)

  useEffect(() => {
    if (account && isHistoryPaneOpen) {
      dispatch(fetchHistory({ account }))
    }
  }, [account, currentEpoch, isHistoryPaneOpen, dispatch])

  // Currently the api cannot filter by unclaimed AND won so we do it here
  // when the user has selected Uncollected only include positions they won
  const results =
    historyFilter === HistoryFilter.UNCOLLECTED
      ? bets.filter((bet) => {
          return bet.position === bet.round.position || bet.round.failed === true
        })
      : bets

  return (
    <StyledHistory>
      <Header />
      <BetWrapper>
        {isFetchingHistory && (
          <SpinnerWrapper>
            <Spinner size={72} />
          </SpinnerWrapper>
        )}

        {results && results.length > 0 ? (
          orderBy(results, ['round.epoch'], ['desc']).map((bet) => {
            return <HistoricalBet key={bet.id} bet={bet} />
          })
        ) : (
          <Box p="24px">
            <Heading size="lg" textAlign="center" mb="8px">
              {t('No predictions history available')}
            </Heading>
            <Text as="p" textAlign="center">
              {t(
                'If you are sure you should see history here, make sure you’re connected to the correct wallet and try again.',
              )}
            </Text>
          </Box>
        )}
      </BetWrapper>
    </StyledHistory>
  )
}

export default History
