import { useTranslation } from '@pancakeswap/localization'
import { bscTokens } from '@pancakeswap/tokens'
import { Box, ChevronRightIcon, Flex, Loading, Text, useModal } from '@pancakeswap/uikit'
import useLocalDispatch from 'contexts/LocalRedux/useLocalDispatch'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useMemo, useState } from 'react'
import { transformBetResponse } from 'state/predictions/helpers'
import { Bet } from 'state/types'
import { styled } from 'styled-components'
import { getPredictionsV1Address } from 'utils/addressHelpers'
import { useAccount } from 'wagmi'

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
  const [history, setHistory] = useState<Bet[]>([])
  const { t } = useTranslation()
  const { chainId } = useActiveChainId()
  const { address: account } = useAccount()
  const dispatch = useLocalDispatch()
  const predictionsV1Address = useMemo(() => getPredictionsV1Address(), [])

  const [onPresentCollectWinningsModal] = useModal(
    <CollectRoundWinningsModal
      predictionsAddress={predictionsV1Address}
      token={bscTokens.bnb}
      dispatch={dispatch}
      history={history}
      isLoadingHistory={isFetching}
      isV1Claim
      isNativeToken
    />,
    false,
    true,
    'CollectRoundWinningsModalV1',
  )

  const [onPresentNothingToClaimModal] = useModal(<NothingToClaimModal />)

  const handleClick = async () => {
    try {
      setIsFetching(true)
      const betHistory = await getAllV1History({ user: account?.toLowerCase(), claimed: false })

      // Filter out bets that can be claimed
      const unclaimedBets = betHistory.filter((bet) => {
        return bet.round.position === bet.position || bet.round.failed === true
      })

      if (unclaimedBets.length > 0) {
        const transformer = transformBetResponse(bscTokens?.bnb?.symbol, chainId)
        setHistory(unclaimedBets.map(transformer))
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
