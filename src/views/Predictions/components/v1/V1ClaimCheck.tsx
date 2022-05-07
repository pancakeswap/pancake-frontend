import { useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { Box, Flex, Text, ChevronRightIcon, useModal } from '@pancakeswap/uikit'
import Loading from 'components/Loading'
import useLocalDispatch from 'contexts/LocalRedux/useLocalDispatch'
import { useCollectWinningModalProps } from 'state/predictions/hooks'
import { useConfig } from 'views/Predictions/context/ConfigProvider'

import CollectRoundWinningsModal from '../CollectRoundWinningsModal'
import { getAllV1History } from './helpers'
import NothingToClaimModal from './NothingToClaimModal'

const StyledClaimCheck = styled(Flex)`
  align-items: center;
  background-color: ${({ theme }) => theme.card.background};
  border-bottom: 1px solid ${({ theme }) => theme.colors.cardBorder};
  cursor: pointer;
  justify-content: space-between;
  padding: 16px;
`

const ClaimCheck = () => {
  const [isFetching, setIsFetching] = useState(false)
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { history, isLoadingHistory } = useCollectWinningModalProps()
  const dispatch = useLocalDispatch()
  const { address: predictionsAddress, token } = useConfig()

  const [onPresentCollectWinningsModal] = useModal(
    <CollectRoundWinningsModal
      predictionsAddress={predictionsAddress}
      token={token}
      dispatch={dispatch}
      history={history}
      isLoadingHistory={isLoadingHistory}
    />,
    false,
  )

  const [onPresentNothingToClaimModal] = useModal(<NothingToClaimModal />)

  const handleClick = async () => {
    try {
      setIsFetching(true)
      const betHistory = await getAllV1History({ user: account.toLowerCase(), claimed: false })

      // Filter out bets that can be claimed
      const unclaimedBets = betHistory.filter((bet) => {
        return bet.round.position === bet.position || bet.round.failed === true
      })

      if (unclaimedBets.length > 0) {
        onPresentCollectWinningsModal()
      } else {
        onPresentNothingToClaimModal()
      }
    } catch (error) {
      console.error('Unable to check v1 history', error)
    } finally {
      setIsFetching(false)
    }
  }

  return (
    <StyledClaimCheck onClick={account ? handleClick : undefined}>
      <Box style={{ flex: 1 }}>
        <Text>{t('Showing history for Prediction v0.2')}</Text>
        <Flex alignItems="center">
          <Text color="primary">{t('Check for unclaimed v0.1 winnings')}</Text>
          <ChevronRightIcon color="primary" width="24px" />
        </Flex>
      </Box>
      {isFetching && (
        <Box px="16px">
          <Loading />
        </Box>
      )}
    </StyledClaimCheck>
  )
}

export default ClaimCheck
