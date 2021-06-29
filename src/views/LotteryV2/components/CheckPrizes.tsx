import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Button, Heading, Flex, useModal, AutoRenewIcon } from '@pancakeswap/uikit'
import { useWeb3React } from '@web3-react/core'
import { useTranslation } from 'contexts/Localization'
import UnlockButton from 'components/UnlockButton'
import ClaimPrizesModal from './ClaimPrizesModal'
import useGetUnclaimedRewards, { FetchStatus } from '../hooks/useGetUnclaimedRewards'

const TicketImage = styled.img`
  height: 100px;
`

const TornTicketImage = styled.img`
  height: 84px;
`

const CheckPrizes = () => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { fetchAllRewards, unclaimedRewards, fetchStatus } = useGetUnclaimedRewards()
  const [hasCheckedForRewards, setHasCheckedForRewards] = useState(false)
  const [hasRewardsToClaim, setHasRewardsToClaim] = useState(false)
  const [onPresentClaimModal] = useModal(<ClaimPrizesModal roundsToClaim={unclaimedRewards} />, false)
  const isFetchingRewards = fetchStatus === FetchStatus.IN_PROGRESS

  useEffect(() => {
    if (fetchStatus === FetchStatus.SUCCESS) {
      // Manage showing unclaimed rewards modal once per visit
      if (unclaimedRewards.length > 0 && !hasCheckedForRewards) {
        setHasRewardsToClaim(true)
        setHasCheckedForRewards(true)
        onPresentClaimModal()
      }

      if (unclaimedRewards.length === 0 && !hasCheckedForRewards) {
        setHasRewardsToClaim(false)
        setHasCheckedForRewards(true)
      }
    }
  }, [unclaimedRewards, hasCheckedForRewards, fetchStatus, onPresentClaimModal])

  useEffect(() => {
    // Clear local state on account change
    setHasRewardsToClaim(false)
    setHasCheckedForRewards(false)
  }, [account])

  const getBody = () => {
    if (!account) {
      return (
        <Flex alignItems="center" justifyContent="center">
          <TicketImage src="/images/lottery/ticket-l.png" alt="lottery ticket" />
          <Flex mx="16px" flexDirection="column" alignItems="center">
            <Heading textAlign="center" color="#F4EEFF">
              {t('Connect your wallet')}
            </Heading>
            <Heading textAlign="center" color="#F4EEFF" mb="24px">
              {t("to check if you've won!")}
            </Heading>
            <UnlockButton width="190px" />
          </Flex>
          <TicketImage src="/images/lottery/ticket-r.png" alt="lottery ticket" />
        </Flex>
      )
    }
    if (hasCheckedForRewards && !hasRewardsToClaim) {
      return (
        <Flex alignItems="center" justifyContent="center">
          <TornTicketImage src="/images/lottery/torn-ticket-l.png" alt="torn lottery ticket" />
          <Flex mx="16px" flexDirection="column">
            <Heading textAlign="center" color="#F4EEFF">
              {t('No prizes to collect')}...
            </Heading>
            <Heading textAlign="center" color="#F4EEFF">
              {t('Better luck next time!')}
            </Heading>
          </Flex>
          <TornTicketImage src="/images/lottery/torn-ticket-r.png" alt="torn lottery ticket" />
        </Flex>
      )
    }
    if (hasCheckedForRewards && hasRewardsToClaim) {
      return (
        <Flex alignItems="center" justifyContent="center">
          <TicketImage src="/images/lottery/ticket-l.png" alt="lottery ticket" />
          <Flex mx="16px" flexDirection="column">
            <Heading textAlign="center" color="#F4EEFF">
              {t('Congratulations on winning')}
            </Heading>
          </Flex>
          <TicketImage src="/images/lottery/ticket-r.png" alt="lottery ticket" />
        </Flex>
      )
    }
    return (
      <Flex alignItems="center" justifyContent="center">
        <TicketImage src="/images/lottery/ticket-l.png" alt="lottery ticket" />
        <Flex mx="16px" flexDirection="column">
          <Heading textAlign="center" color="#F4EEFF" mb="24px">
            {t('Are you a winner?')}
          </Heading>
          <Button
            onClick={() => fetchAllRewards()}
            isLoading={isFetchingRewards}
            endIcon={isFetchingRewards ? <AutoRenewIcon color="currentColor" spin /> : null}
          >
            {isFetchingRewards ? t('Checking') : t('Check Now')}
          </Button>
        </Flex>
        <TicketImage src="/images/lottery/ticket-r.png" alt="lottery ticket" />
      </Flex>
    )
  }

  return <Flex>{getBody()}</Flex>
}

export default CheckPrizes
