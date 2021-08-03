import React, { useState, useEffect } from 'react'
import CountUp from 'react-countup'
import { Text, Flex, Skeleton } from '@pancakeswap/uikit'
import { useFarmAuctionContract } from 'hooks/useContract'
import { useTranslation } from 'contexts/Localization'
import { usePriceCakeBusd } from 'state/farms/hooks'
import { getBalanceNumber } from 'utils/formatBalance'
import { ethersToBigNumber } from 'utils/bigNumber'

const AuctionCakeBurn: React.FC = () => {
  const [burnedCakeAmount, setBurnedCakeAmount] = useState(null)
  const { t } = useTranslation()
  const farmAuctionContract = useFarmAuctionContract()
  const cakePriceBusd = usePriceCakeBusd()

  const burnedAmountAsUSD = cakePriceBusd.times(burnedCakeAmount).toNumber()

  useEffect(() => {
    const fetchBurnedCakeAmount = async () => {
      try {
        const amount = await farmAuctionContract.totalCollected()
        const amountAsBN = ethersToBigNumber(amount)
        setBurnedCakeAmount(getBalanceNumber(amountAsBN))
      } catch (error) {
        console.error('Failed to fetch burned auction cake', error)
      }
    }
    if (!burnedCakeAmount) {
      fetchBurnedCakeAmount()
    }
  }, [burnedCakeAmount, farmAuctionContract])
  return (
    <Flex flexDirection={['column-reverse', null, 'row']}>
      <Flex flexDirection="column" flex="2">
        {burnedCakeAmount !== null ? (
          <Text fontSize="64px" bold>
            <CountUp start={0} end={burnedCakeAmount} suffix=" CAKE" decimals={0} duration={1} separator="," />
          </Text>
        ) : (
          <Skeleton width="256px" height="64px" />
        )}
        <Text textTransform="uppercase" fontSize="64px" bold color="secondary">
          {t('Burned')}
        </Text>
        <Text fontSize="24px" bold>
          {t('through community auctions so far!')}
        </Text>
        {!Number.isNaN(burnedAmountAsUSD) ? (
          <Text color="textSubtle">~${burnedAmountAsUSD.toLocaleString('en', { maximumFractionDigits: 0 })}</Text>
        ) : (
          <Skeleton width="128px" />
        )}
      </Flex>
      <Flex flex="1" alignSelf="center">
        <img width="350px" height="320px" src="/images/burnt-cake.png" alt="Burnt CAKE" />
      </Flex>
    </Flex>
  )
}

export default AuctionCakeBurn
