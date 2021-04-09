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
  const balance = getBalanceNumber(lotteryPrizeAmount)
  const lotteryPrizeAmountCake = balance.toLocaleString(undefined, {
    maximumFractionDigits: 2,
  })
  const cakePriceBusd = usePriceCakeBusd()
  const lotteryPrizeAmountBusd = new BigNumber(balance).multipliedBy(cakePriceBusd).toNumber()

  return (
    <>
      <Text bold fontSize="24px" style={{ lineHeight: '1.5' }}>
        {TranslateString(999, `${lotteryPrizeAmountCake} CAKE`, { amount: lotteryPrizeAmountCake })}
      </Text>
      {!cakePriceBusd.eq(0) ? <CardBusdValue value={lotteryPrizeAmountBusd} /> : <br />}
    </>
  )
}

export default LotteryJackpot
