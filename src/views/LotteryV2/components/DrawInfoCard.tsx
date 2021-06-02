import React from 'react'
import styled from 'styled-components'
import { Card, CardHeader, CardBody, Flex, Heading, Text, Skeleton } from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import { useTranslation } from 'contexts/Localization'
import { useLottery, usePriceCakeBusd } from 'state/hooks'
import { getBalanceNumber, getFullDisplayBalance } from 'utils/formatBalance'
import Balance from 'components/Balance'

const DrawInfoCard = () => {
  const { t } = useTranslation()
  const {
    currentLotteryId,
    currentRound: { endTime, amountCollectedInCake },
  } = useLottery()
  // TODO: Re-enebale in prod
  //   const cakePriceBusd = usePriceCakeBusd()
  const cakePriceBusd = new BigNumber(20.55)
  const prizeInBusd = amountCollectedInCake.times(cakePriceBusd)
  const endDate = new Date(parseInt(endTime, 10) * 1000)

  return (
    <Card>
      <CardHeader p="16px 24px">
        <Flex justifyContent="space-between">
          <Heading>{t('Next Draw')}</Heading>
          <Text>
            #{currentLotteryId} | {endDate.toLocaleString()}
          </Text>
        </Flex>
      </CardHeader>
      <CardBody>
        <Flex>
          <Heading>{t('Prize Pot')}</Heading>
          <Flex flexDirection="column">
            {prizeInBusd.gt(0) ? (
              <Balance
                lineHeight="1"
                color="secondary"
                fontSize="40px"
                bold
                prefix="~$"
                value={getBalanceNumber(prizeInBusd)}
                decimals={0}
              />
            ) : (
              <Skeleton my="7px" height={40} width={160} />
            )}
            {prizeInBusd.gt(0) ? (
              <Balance
                color="textSubtle"
                fontSize="14px"
                value={getBalanceNumber(amountCollectedInCake)}
                unit=" CAKE"
                decimals={0}
              />
            ) : (
              <Skeleton my="2px" height={14} width={90} />
            )}
          </Flex>
        </Flex>
      </CardBody>

      <CardBody>ss</CardBody>
    </Card>
  )
}

export default DrawInfoCard
