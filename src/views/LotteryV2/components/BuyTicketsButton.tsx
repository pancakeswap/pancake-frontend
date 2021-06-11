import React from 'react'
import { Button, useModal, WaitIcon } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { useLottery } from 'state/hooks'
import { LotteryStatus } from 'config/constants/types'
import BuyTicketsModal from './BuyTicketsModal'

const BuyTicketsButton = ({ ...props }) => {
  const { t } = useTranslation()
  const [onPresentBuyTicketsModal] = useModal(<BuyTicketsModal />)
  const {
    currentRound: { status },
  } = useLottery()
  const canBuyTickets = status === LotteryStatus.OPEN

  const getBuyButtonText = () => {
    if (status === LotteryStatus.PENDING || status === LotteryStatus.CLAIMABLE) {
      return (
        <>
          <WaitIcon mr="4px" color="textDisabled" /> {t('On sale soon!')}
        </>
      )
    }
    if (status === LotteryStatus.CLOSE) {
      return (
        <>
          <WaitIcon mr="4px" color="textDisabled" /> {t('Calculating rewards!')}
        </>
      )
    }
    return t('Buy Tickets')
  }

  return (
    <Button {...props} disabled={!canBuyTickets} onClick={onPresentBuyTicketsModal}>
      {getBuyButtonText()}
    </Button>
  )
}

export default BuyTicketsButton
