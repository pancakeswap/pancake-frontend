import React from 'react'
import { Text } from '@pancakeswap-libs/uikit'
import { getBalanceNumber } from 'utils/formatBalance'
import { useTotalRewards } from 'hooks/useTickets'
import useI18n from 'hooks/useI18n'
import { usePriceCakeBusd } from 'state/hooks'
import { BigNumber } from 'bignumber.js'
import CardBusdValue from './CardBusdValue'

const LotteryJackpot = () => {
  const TranslateString = useI18n()
  const lotteryPrizeAmount = useTotalRewards()
  const lotteryPrizeAmountBusd = new BigNumber(getBalanceNumber(lotteryPrizeAmount))
    .multipliedBy(usePriceCakeBusd())
    .toNumber()

  return (
    <>
      <Text bold fontSize="24px" style={{ lineHeight: '1.5' }}>
        {getBalanceNumber(lotteryPrizeAmount).toLocaleString(undefined, {
          maximumFractionDigits: 2,
        })}{' '}
        {TranslateString(999, 'CAKE')}
      </Text>
      <CardBusdValue value={lotteryPrizeAmountBusd} />
    </>
  )
}

export default LotteryJackpot
