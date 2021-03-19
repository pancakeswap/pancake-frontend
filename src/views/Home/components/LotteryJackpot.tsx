import React, { useMemo } from 'react'
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
  const balance = getBalanceNumber(lotteryPrizeAmount)
  const lotteryPrizeAmoutCake = balance.toLocaleString(undefined, {
    maximumFractionDigits: 2,
  })
  const cakePrice = usePriceCakeBusd()

  const lotteryPrizeAmountBusd = Number.isNaN(cakePrice.toNumber()) || Number.isNaN(balance)
    ? 0
    : new BigNumber(balance).multipliedBy(cakePrice).toNumber()

  return (
    <>
      <Text bold fontSize="24px" style={{ lineHeight: '1.5' }}>
        {lotteryPrizeAmoutCake} {TranslateString(999, 'CAKE')}
      </Text>
      <CardBusdValue value={lotteryPrizeAmountBusd} />
    </>
  )
}

export default LotteryJackpot
