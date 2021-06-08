import React from 'react'
import { Button, useModal, WaitIcon } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { useLottery } from 'state/hooks'
import { LotteryStatus } from 'state/types'
import BuyTicketsModal from './BuyTicketsModal'

const BuyTicketsButton = ({ ...props }) => {
  const { t } = useTranslation()
  const [onPresentBuyTicketsModal] = useModal(<BuyTicketsModal />)
  const {
    currentRound: { status },
  } = useLottery()
  const isLotteryOpen = status === LotteryStatus.OPEN

  return (
    <Button {...props} disabled={!isLotteryOpen} onClick={onPresentBuyTicketsModal}>
      {isLotteryOpen ? (
        t('Buy Tickets')
      ) : (
        <>
          <WaitIcon mr="4px" color="textDisabled" /> {t('On sale soon!')}
        </>
      )}
    </Button>
  )
}

export default BuyTicketsButton
