import React, { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'
import { Modal, Text, Flex, HelpIcon, Button, BalanceInput, Ticket, useTooltip, Skeleton } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { useWeb3React } from '@web3-react/core'
import { getFullDisplayBalance } from 'utils/formatBalance'
import { getCakeAddress } from 'utils/addressHelpers'
import { usePriceCakeBusd, useLottery } from 'state/hooks'
import useTheme from 'hooks/useTheme'
import useTokenBalance, { FetchStatus } from 'hooks/useTokenBalance'
import useApproveConfirmTransaction from 'hooks/useApproveConfirmTransaction'
import { useCake } from 'hooks/useContract'
import useToast from 'hooks/useToast'
import { getLotteryV2Contract } from 'utils/contractHelpers'
import UnlockButton from 'components/UnlockButton'
import ApproveConfirmButtons, { ButtonArrangement } from 'views/Profile/components/ApproveConfirmButtons'
import TicketsNumberButton from './TicketsNumberButton'
import { generateTicketNumbers } from '../helpers'

interface BuyTicketsModalProps {
  onDismiss?: () => void
}

interface Discount {
  ticketThreshold: number
  percentageDiscount: number
}

const BuyTicketsModal: React.FC<BuyTicketsModalProps> = ({ onDismiss }) => {
  const { account } = useWeb3React()
  const { t } = useTranslation()
  const { theme } = useTheme()
  const {
    maxNumberTicketsPerBuy,
    currentLotteryId,
    currentRound: { priceTicketInCake },
  } = useLottery()
  const lotteryContract = getLotteryV2Contract()
  const [ticketsToBuy, setTicketsToBuy] = useState('')
  const [discountValue, setDiscountValue] = useState('')
  const [totalCost, setTotalCost] = useState('')
  const [possibleCakeExceeded, setPossibleCakeExceeded] = useState(false)
  const cakeContract = useCake()
  const { toastSuccess } = useToast()
  const { balance: userCake, fetchStatus } = useTokenBalance(getCakeAddress())
  const hasFetchedBalance = fetchStatus === FetchStatus.SUCCESS
  const cakePriceBusd = usePriceCakeBusd()
  const userCakeDisplayBalance = getFullDisplayBalance(userCake, 18, 3)

  const TooltipComponent = () => (
    <>
      <Text mb="16px">{t('Bulk discount for buying multiple tickets in a single transaction.')}</Text>
      <Text>{t('0-99 tickets: 0% discount')}</Text>
      <Text>{t('100-499 tickets: 2% discount')}</Text>
      <Text mb="16px">{t('500+ tickets: 5% discount')}</Text>
      <Text>{t('Check the FAQs at the bottom of the page for more.')}</Text>
    </>
  )
  const { targetRef, tooltip, tooltipVisible } = useTooltip(<TooltipComponent />, {
    placement: 'bottom-end',
    tooltipOffset: [20, 10],
  })

  useEffect(() => {
    const discounts: Discount[] = [
      { ticketThreshold: 100, percentageDiscount: 2 },
      { ticketThreshold: 500, percentageDiscount: 5 },
    ]
    const ticketsAsInt = ticketsToBuy ? parseInt(ticketsToBuy, 10) : 0

    const getDiscount = () => {
      if (ticketsToBuy) {
        // TODO: Improve func based on SC data structure
        const eligibleDiscounts = discounts.filter((discount) => {
          return ticketsAsInt > discount.ticketThreshold
        })
        if (eligibleDiscounts.length > 0) {
          const discountToApply = eligibleDiscounts.reduce((accum, item) => {
            return accum.percentageDiscount < item.percentageDiscount ? item : accum
          })
          return discountToApply
        }
      }
      return null
    }
    const discountToApply = getDiscount()
    // TODO: Reinstate logic when discount logic finalised
    const shouldApplyDiscount = false

    const applyDiscount = () => {
      const ticketsToDiscount = (ticketsAsInt / 100) * discountToApply.percentageDiscount
      const valueToDiscount = priceTicketInCake.times(ticketsToDiscount)
      const costOfTickets = priceTicketInCake.times(ticketsAsInt).minus(valueToDiscount)
      setDiscountValue(getFullDisplayBalance(valueToDiscount, 18, 3))
      setTotalCost(getFullDisplayBalance(costOfTickets))
    }

    if (shouldApplyDiscount) {
      applyDiscount()
    } else {
      const costOfTickets = priceTicketInCake.times(ticketsAsInt)
      setTotalCost(getFullDisplayBalance(costOfTickets))
    }
  }, [ticketsToBuy, priceTicketInCake])

  const getMaxPossiblePurchase = (): BigNumber => {
    const maxBalancePurchase = userCake.div(priceTicketInCake)
    const maxPurchase = maxBalancePurchase.gt(maxNumberTicketsPerBuy) ? maxNumberTicketsPerBuy : maxBalancePurchase
    return maxPurchase
  }

  const getNumTicketsByPercentage = (percentage: number): number => {
    const maxTickets = getMaxPossiblePurchase()
    const percentageOfMaxTickets = maxTickets.div(new BigNumber(100)).times(new BigNumber(percentage))
    return Math.floor(percentageOfMaxTickets.toNumber())
  }

  const tenPercentOfBalance = getNumTicketsByPercentage(10)
  const twentyFivePercentOfBalance = getNumTicketsByPercentage(25)
  const fiftyPercentOfBalance = getNumTicketsByPercentage(50)
  const oneHundredPercentOfBalance = getNumTicketsByPercentage(100)

  const getCakeValueOfTickets = (numberOfTickets: BigNumber): BigNumber => {
    const totalTicketsCakeValue = priceTicketInCake.times(numberOfTickets)
    return totalTicketsCakeValue
  }

  const handleInputChange = (input: string) => {
    const inputAsInteger = parseInt(input, 10)
    const cakeValueOfInput = getCakeValueOfTickets(new BigNumber(inputAsInteger))
    // TODO: Make this responsive to max buy
    if (cakeValueOfInput.gt(userCake)) {
      setPossibleCakeExceeded(true)
    } else {
      setPossibleCakeExceeded(false)
    }
    setTicketsToBuy(inputAsInteger ? inputAsInteger.toFixed() : '0')
  }

  const handleNumberButtonClick = (number: number) => {
    setTicketsToBuy(number.toFixed())
    setPossibleCakeExceeded(false)
  }

  const { isApproving, isApproved, isConfirmed, isConfirming, handleApprove, handleConfirm } =
    useApproveConfirmTransaction({
      onRequiresApproval: async () => {
        try {
          const response = await cakeContract.methods.allowance(account, lotteryContract.options.address).call()
          const currentAllowance = new BigNumber(response)
          return currentAllowance.gt(0)
        } catch (error) {
          return false
        }
      },
      onApprove: () => {
        return cakeContract.methods
          .approve(lotteryContract.options.address, ethers.constants.MaxUint256)
          .send({ from: account })
      },
      onApproveSuccess: async () => {
        toastSuccess(t('Contract approved - you can now purchase tickets'))
      },
      onConfirm: () => {
        const ticketNumArray = generateTicketNumbers(parseInt(ticketsToBuy, 10))
        return lotteryContract.methods.buyTickets(currentLotteryId, ticketNumArray).send({ from: account })
      },
      onSuccess: async () => {
        onDismiss()
        toastSuccess(t('Lottery tickets purchased!'))
      },
    })

  return (
    <>
      <Modal title={t('Buy Tickets')} onDismiss={onDismiss} headerBackground={theme.colors.gradients.cardHeader}>
        {tooltipVisible && tooltip}
        <Flex alignItems="center" justifyContent="space-between" mb="8px">
          <Text color="textSubtle">{t('Buy')}:</Text>
          <Flex alignItems="center" minWidth="70px">
            <Text mr="4px" bold>
              {t('Tickets')}
            </Text>
            <Ticket />
          </Flex>
        </Flex>
        {/* TODO: Error when value is over user's cake balance */}
        <BalanceInput
          isWarning={possibleCakeExceeded}
          value={ticketsToBuy}
          onUserInput={handleInputChange}
          currencyValue={
            cakePriceBusd.gt(0) &&
            `~${ticketsToBuy ? getFullDisplayBalance(getCakeValueOfTickets(new BigNumber(ticketsToBuy))) : '0.00'} CAKE`
          }
        />
        <Flex alignItems="center" justifyContent="flex-end" mt="4px" mb="12px">
          <Flex justifyContent="flex-end" flexDirection="column">
            {possibleCakeExceeded && (
              <Text fontSize="12px" color="failure">
                {t('Insufficient CAKE balance')}
              </Text>
            )}
            <Flex justifyContent="flex-end">
              <Text fontSize="12px" color="textSubtle" mr="4px">
                CAKE {t('Balance')}:
              </Text>
              {hasFetchedBalance ? (
                <Text fontSize="12px" color="textSubtle">
                  {userCakeDisplayBalance}
                </Text>
              ) : (
                <Skeleton width={50} height={12} />
              )}
            </Flex>
          </Flex>
        </Flex>

        <Flex alignItems="center" justifyContent="space-between" mt="8px" mb="24px">
          <TicketsNumberButton
            disabled={!hasFetchedBalance}
            onClick={() => handleNumberButtonClick(tenPercentOfBalance)}
          >
            {hasFetchedBalance ? tenPercentOfBalance : ``}
          </TicketsNumberButton>
          <TicketsNumberButton
            disabled={!hasFetchedBalance}
            onClick={() => handleNumberButtonClick(twentyFivePercentOfBalance)}
          >
            {hasFetchedBalance ? twentyFivePercentOfBalance : ``}
          </TicketsNumberButton>
          <TicketsNumberButton
            disabled={!hasFetchedBalance}
            onClick={() => handleNumberButtonClick(fiftyPercentOfBalance)}
          >
            {hasFetchedBalance ? fiftyPercentOfBalance : ``}
          </TicketsNumberButton>
          <TicketsNumberButton
            disabled={!hasFetchedBalance}
            onClick={() => handleNumberButtonClick(oneHundredPercentOfBalance)}
          >
            MAX
          </TicketsNumberButton>
        </Flex>

        <Flex flexDirection="column">
          <Flex mb="8px" justifyContent="space-between">
            <Flex>
              <Text color="textSubtle">{t('Bulk discount')}</Text>
              <Flex alignItems="center" justifyContent="center" ref={targetRef}>
                <HelpIcon ml="4px" width="14px" height="14px" color="textSubtle" />
              </Flex>
            </Flex>
            {/* TODO: re-implement discount when logic finalised */}
            {/* <Text color="textSubtle">~{discountValue} CAKE</Text> */}
            <Text color="textSubtle">~ CAKE</Text>
          </Flex>
          <Flex mb="24px" justifyContent="space-between">
            <Text color="textSubtle">{t('Total cost')}</Text>
            {/* TODO: Calculate total cost when discount logic added */}
            <Text color="textSubtle">~{totalCost} CAKE</Text>
          </Flex>

          {account ? (
            <ApproveConfirmButtons
              isApproveDisabled={isApproved}
              isApproving={isApproving}
              isConfirmDisabled={
                !isApproved ||
                isConfirmed ||
                possibleCakeExceeded ||
                !ticketsToBuy ||
                new BigNumber(ticketsToBuy).lte(0)
              }
              isConfirming={isConfirming}
              onApprove={handleApprove}
              onConfirm={handleConfirm}
              buttonArrangement={ButtonArrangement.SEQUENTIAL}
            />
          ) : (
            <UnlockButton />
          )}

          <Text mt="24px" fontSize="12px" color="textSubtle" maxWidth="280px">
            {t(
              'The CAKE ticket price is set before each lottery round starts, equal to $1 at that time. Ticket purchases are final.',
            )}
          </Text>
        </Flex>
      </Modal>
    </>
  )
}

export default BuyTicketsModal
