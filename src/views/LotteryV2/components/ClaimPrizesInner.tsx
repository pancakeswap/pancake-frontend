import React, { useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { Flex, Button, Text, AutoRenewIcon, Won } from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import { useTranslation } from 'contexts/Localization'
import { LotteryTicketClaimData } from 'config/constants/types'
import { getBalanceAmount } from 'utils/formatBalance'
import { usePriceCakeBusd } from 'state/hooks'
import Balance from 'components/Balance'
import useToast from 'hooks/useToast'
import { useLotteryV2Contract } from 'hooks/useContract'
import { parseClaimDataForClaimTicketsCall } from '../helpers'

interface ClaimInnerProps {
  roundsToClaim: LotteryTicketClaimData[]
  onSuccess?: () => void
}

const ClaimInnerContainer: React.FC<ClaimInnerProps> = ({ onSuccess, roundsToClaim }) => {
  const { account } = useWeb3React()
  const { t } = useTranslation()
  const { toastSuccess, toastError } = useToast()
  const [activeClaimIndex, setActiveClaimIndex] = useState(0)
  const [pendingTx, setPendingTx] = useState(false)
  // TODO: Re-enebale in prod
  //   const cakePriceBusd = usePriceCakeBusd()
  const lotteryContract = useLotteryV2Contract()
  const cakePriceBusd = new BigNumber(20)
  const cakeReward = roundsToClaim[activeClaimIndex].cakeTotal
  const dollarReward = cakeReward.times(cakePriceBusd)
  const rewardAsBalance = getBalanceAmount(cakeReward).toNumber()
  const dollarRewardAsBalance = getBalanceAmount(dollarReward).toNumber()
  const round = roundsToClaim[activeClaimIndex].roundId
  const claimTicketsCallData = parseClaimDataForClaimTicketsCall(roundsToClaim[activeClaimIndex])

  const handleProgressToNextClaim = () => {
    if (roundsToClaim.length > activeClaimIndex + 1) {
      // If there are still rounds to claim, move onto the next claim
      setActiveClaimIndex(activeClaimIndex + 1)
    } else {
      onSuccess()
    }
  }

  const handleClaim = () => {
    const { lotteryId, ticketIds, brackets } = claimTicketsCallData
    lotteryContract.methods
      .claimTickets(lotteryId, ticketIds, brackets)
      .send({ from: account })
      .on('sending', () => {
        setPendingTx(true)
      })
      .on('receipt', () => {
        toastSuccess(t('Prizes Collected!'), t(`Your CAKE prizes for round ${lotteryId} have been sent to your wallet`))
        setPendingTx(false)
        handleProgressToNextClaim()
      })
      .on('error', (error) => {
        console.error(error)
        toastError(t('Error'), t('%error% - Please try again.', { error: error.message }))
        setPendingTx(false)
      })
  }

  return (
    <>
      <Flex flexDirection="column">
        <Text mb="4px" textAlign={['center', null, 'left']}>
          {t('You won')}
        </Text>
        <Flex
          alignItems={['flex-start', null, 'center']}
          justifyContent={['flex-start', null, 'center']}
          flexDirection={['column', null, 'row']}
        >
          <Balance
            textAlign={['center', null, 'left']}
            lineHeight="1.1"
            value={rewardAsBalance}
            fontSize="44px"
            bold
            color="secondary"
            unit=" CAKE!"
          />
          <Won ml={['0', null, '12px']} width="64px" />
        </Flex>
        <Balance
          mt={['12px', null, '0']}
          textAlign={['center', null, 'left']}
          value={dollarRewardAsBalance}
          fontSize="12px"
          color="textSubtle"
          unit=" USD"
          prefix="~"
        />
      </Flex>

      <Flex alignItems="center" justifyContent="center">
        <Text mt="8px" fontSize="12px" color="textSubtle">
          {t('Round')} #{round}
        </Text>
      </Flex>
      <Flex alignItems="center" justifyContent="center">
        <Button
          isLoading={pendingTx}
          endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
          mt="20px"
          width="100%"
          onClick={() => handleClaim()}
        >
          {pendingTx ? t('Claiming') : t('Claim')}
        </Button>
      </Flex>
    </>
  )
}

export default ClaimInnerContainer
