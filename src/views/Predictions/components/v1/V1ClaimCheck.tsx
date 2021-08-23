import React, { useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { Box, Flex, Text, ChevronRightIcon, useModal } from '@pancakeswap/uikit'
import Loading from 'components/Loading'
import { getMultiplier } from '../History/helpers'
import CollectRoundWinningsModal from '../CollectRoundWinningsModal'
import { getAllV1History } from './helpers'
import NothingToClaimModal from './NothingToClaimModal'

interface State {
  payout: string
  betAmount: string
  epoch: number
}

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
  const [betToClaim, setBetToClaim] = useState<State>({
    payout: '0',
    betAmount: '0',
    epoch: 0,
  })
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { payout, betAmount, epoch } = betToClaim

  const [onPresentCollectWinningsModal] = useModal(
    <CollectRoundWinningsModal payout={payout} betAmount={betAmount} epoch={epoch} />,
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
        const [firstBetToClaim] = unclaimedBets
        const amount = firstBetToClaim.amount ? parseFloat(firstBetToClaim.amount) : 0
        const totalAmount = firstBetToClaim.round.totalAmount ? parseFloat(firstBetToClaim.round.totalAmount) : 0
        const multiplier = getMultiplier(totalAmount, amount)
        const betPayout = totalAmount * multiplier

        setBetToClaim({
          betAmount: amount.toString(),
          payout: betPayout.toString(),
          epoch: Number(firstBetToClaim.round.epoch),
        })

        setTimeout(() => onPresentCollectWinningsModal())
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
